import { NotificationType, Prisma, ProjectRole, TeamRole } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { errors } from "../../utils/appError";
import { requireProjectRole, requireTeamRole } from "../../middleware/authorization";
import { emitToProject, emitToTeam, emitToUser } from "../../websocket/socket";

export async function createProject(userId: string, data: { teamId: string; name: string; description?: string; status?: string; startDate?: Date; dueDate?: Date }) {
  await requireTeamRole(userId, data.teamId, TeamRole.MANAGER);
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        teamId: data.teamId,
        name: data.name,
        description: data.description,
        status: data.status as never,
        startDate: data.startDate,
        dueDate: data.dueDate,
        createdById: userId
      }
    });
    await tx.projectMember.create({ data: { projectId: project.id, userId, role: ProjectRole.MANAGER } });
    await tx.activityLog.create({ data: { projectId: project.id, userId, action: "PROJECT_CREATED", entityType: "PROJECT", entityId: project.id } });
    emitToTeam(data.teamId, "project.updated", project);
    return project;
  });
}

export async function listProjects(userId: string) {
  return prisma.project.findMany({
    where: { members: { some: { userId } } },
    include: { team: true, members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } } },
    orderBy: { createdAt: "desc" }
  });
}

export async function getProject(userId: string, projectId: string) {
  await requireProjectRole(userId, projectId, ProjectRole.VIEWER);
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { team: true, members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } } }
  });
  if (!project) throw errors.notFound("PROJECT_NOT_FOUND", "Project not found");
  return project;
}

export async function updateProject(userId: string, projectId: string, data: Prisma.ProjectUpdateInput) {
  await requireProjectRole(userId, projectId, ProjectRole.MANAGER);
  const project = await prisma.$transaction(async (tx) => {
    const updated = await tx.project.update({ where: { id: projectId }, data });
    await tx.activityLog.create({ data: { projectId, userId, action: "PROJECT_UPDATED", entityType: "PROJECT", entityId: projectId, metadata: data as Prisma.InputJsonValue } });
    return updated;
  });
  emitToProject(projectId, "project.updated", project);
  return project;
}

export async function deleteProject(userId: string, projectId: string) {
  await requireProjectRole(userId, projectId, ProjectRole.MANAGER);
  await prisma.project.delete({ where: { id: projectId } });
}

export async function addMember(userId: string, projectId: string, data: { userId: string; role: ProjectRole }) {
  await requireProjectRole(userId, projectId, ProjectRole.MANAGER);
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { teamId: true, name: true } });
  if (!project) throw errors.notFound("PROJECT_NOT_FOUND", "Project not found");
  await requireTeamRole(data.userId, project.teamId, TeamRole.VIEWER);
  const result = await prisma.$transaction(async (tx) => {
    const member = await tx.projectMember.create({ data: { projectId, userId: data.userId, role: data.role } });
    const notification = await tx.notification.create({
      data: {
        userId: data.userId,
        type: NotificationType.PROJECT_INVITATION,
        title: "Added to project",
        message: `You were added to ${project.name}`,
        data: { projectId }
      }
    });
    await tx.activityLog.create({ data: { projectId, userId, action: "MEMBER_ADDED", entityType: "USER", entityId: data.userId, metadata: { role: data.role } } });
    return { member, notification };
  });
  emitToProject(projectId, "member.joined", result.member);
  emitToUser(data.userId, "notification.created", result.notification);
  return result.member;
}

export async function removeMember(userId: string, projectId: string, targetUserId: string) {
  await requireProjectRole(userId, projectId, ProjectRole.MANAGER);
  await prisma.$transaction(async (tx) => {
    await tx.projectMember.delete({ where: { projectId_userId: { projectId, userId: targetUserId } } });
    await tx.activityLog.create({ data: { projectId, userId, action: "MEMBER_REMOVED", entityType: "USER", entityId: targetUserId } });
  });
  emitToProject(projectId, "member.removed", { projectId, userId: targetUserId });
}
