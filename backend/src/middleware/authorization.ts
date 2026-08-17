import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ProjectRole, TeamRole } from "@prisma/client";
import { prisma } from "../prisma/client";
import { errors } from "../utils/appError";

const teamRank: Record<TeamRole, number> = {
  VIEWER: 1,
  MEMBER: 2,
  MANAGER: 3,
  ADMIN: 4,
  OWNER: 5
};

const projectRank: Record<ProjectRole, number> = {
  VIEWER: 1,
  MEMBER: 2,
  MANAGER: 3
};

export async function requireTeamRole(userId: string, teamId: string, minimum: TeamRole): Promise<void> {
  const member = await prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId } } });
  if (!member) throw errors.forbidden("Team membership required");
  if (teamRank[member.role] < teamRank[minimum]) throw errors.forbidden("Insufficient team role");
}

export async function requireProjectRole(userId: string, projectId: string, minimum: ProjectRole): Promise<void> {
  const member = await prisma.projectMember.findUnique({ where: { projectId_userId: { projectId, userId } } });
  if (!member) throw errors.forbidden("Project membership required");
  if (projectRank[member.role] < projectRank[minimum]) throw errors.forbidden("Insufficient project role");
}

export async function assertProjectUser(projectId: string, userId: string): Promise<void> {
  const member = await prisma.projectMember.findUnique({ where: { projectId_userId: { projectId, userId } } });
  if (!member) throw errors.forbidden("Project membership required");
}

export async function assertTaskUser(taskId: string, userId: string): Promise<{ projectId: string }> {
  const task = await prisma.task.findUnique({ where: { id: taskId }, select: { projectId: true } });
  if (!task) throw errors.notFound("TASK_NOT_FOUND", "Task not found");
  await assertProjectUser(task.projectId, userId);
  return task;
}

export const requireAuthenticated = (req: Request): string => {
  if (!req.user) throw errors.unauthorized();
  return req.user.id;
};

export const projectRoleGuard =
  (projectIdSource: "params.id" | "params.projectId" | "body.projectId", role: ProjectRole): RequestHandler =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = requireAuthenticated(req);
      const projectId =
        projectIdSource === "params.id" ? req.params.id : projectIdSource === "params.projectId" ? req.params.projectId : req.body.projectId;
      await requireProjectRole(userId, projectId, role);
      next();
    } catch (error) {
      next(error);
    }
  };
