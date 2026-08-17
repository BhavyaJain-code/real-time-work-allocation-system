import { TeamRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../prisma/client";
import { AppError, errors } from "../../utils/appError";
import { emitToTeam } from "../../websocket/socket";
import { requireTeamRole } from "../../middleware/authorization";

export async function createTeam(userId: string, data: { name: string; description?: string }) {
  return prisma.$transaction(async (tx) => {
    const team = await tx.team.create({ data: { ...data, ownerId: userId } });
    await tx.teamMember.create({ data: { teamId: team.id, userId, role: TeamRole.OWNER } });
    return team;
  });
}

export async function listTeams(userId: string) {
  return prisma.team.findMany({
    where: { members: { some: { userId } } },
    include: { members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } } },
    orderBy: { createdAt: "desc" }
  });
}

export async function getTeam(userId: string, teamId: string) {
  await requireTeamRole(userId, teamId, TeamRole.VIEWER);
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } }, projects: true }
  });
  if (!team) throw errors.notFound("TEAM_NOT_FOUND", "Team not found");
  return team;
}

export async function updateTeam(userId: string, teamId: string, data: { name?: string; description?: string }) {
  await requireTeamRole(userId, teamId, TeamRole.ADMIN);
  const team = await prisma.team.update({ where: { id: teamId }, data });
  emitToTeam(teamId, "project.updated", { teamId, team });
  return team;
}

export async function deleteTeam(userId: string, teamId: string) {
  await requireTeamRole(userId, teamId, TeamRole.OWNER);
  await prisma.team.delete({ where: { id: teamId } });
}

export async function addMember(userId: string, teamId: string, data: { userId: string; role: TeamRole }) {
  await requireTeamRole(userId, teamId, TeamRole.ADMIN);
  if (data.role === TeamRole.OWNER) throw new AppError("INVALID_ROLE", "Use team ownership transfer for OWNER role", StatusCodes.BAD_REQUEST);
  const target = await prisma.user.findUnique({ where: { id: data.userId }, select: { id: true } });
  if (!target) throw errors.notFound("USER_NOT_FOUND", "User not found");
  const member = await prisma.teamMember.create({ data: { teamId, userId: data.userId, role: data.role } });
  emitToTeam(teamId, "member.joined", member);
  return member;
}

export async function updateMember(userId: string, teamId: string, targetUserId: string, role: TeamRole) {
  await requireTeamRole(userId, teamId, TeamRole.ADMIN);
  if (role === TeamRole.OWNER) throw new AppError("INVALID_ROLE", "Cannot assign OWNER here", StatusCodes.BAD_REQUEST);
  const member = await prisma.teamMember.update({ where: { teamId_userId: { teamId, userId: targetUserId } }, data: { role } });
  emitToTeam(teamId, "member.joined", member);
  return member;
}

export async function removeMember(userId: string, teamId: string, targetUserId: string) {
  await requireTeamRole(userId, teamId, TeamRole.ADMIN);
  const target = await prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId: targetUserId } } });
  if (!target) throw errors.notFound("TEAM_MEMBER_NOT_FOUND", "Team member not found");
  if (target.role === TeamRole.OWNER) throw new AppError("OWNER_CANNOT_BE_REMOVED", "Team owner cannot be removed", StatusCodes.BAD_REQUEST);
  await prisma.teamMember.delete({ where: { teamId_userId: { teamId, userId: targetUserId } } });
  emitToTeam(teamId, "member.removed", { teamId, userId: targetUserId });
}
