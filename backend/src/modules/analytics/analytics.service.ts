import { ProjectRole, TaskStatus, TeamRole } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { requireProjectRole, requireTeamRole } from "../../middleware/authorization";

function countMap(rows: unknown[], key: string) {
  return Object.fromEntries(
    rows.map((item) => {
      const row = item as Record<string, unknown> & { _count?: { _all?: number } };
      return [String(row[key] ?? "unassigned"), row._count?._all ?? 0];
    })
  );
}

export async function projectAnalytics(userId: string, projectId: string) {
  await requireProjectRole(userId, projectId, ProjectRole.VIEWER);
  const now = new Date();
  const [totalTasks, completedTasks, overdueTasks, byStatus, byPriority, byAssignee] = await prisma.$transaction([
    prisma.task.count({ where: { projectId } }),
    prisma.task.count({ where: { projectId, status: TaskStatus.DONE } }),
    prisma.task.count({ where: { projectId, dueDate: { lt: now }, status: { not: TaskStatus.DONE } } }),
    prisma.task.groupBy({ by: ["status"], where: { projectId }, _count: { _all: true }, orderBy: { status: "asc" } }),
    prisma.task.groupBy({ by: ["priority"], where: { projectId }, _count: { _all: true }, orderBy: { priority: "asc" } }),
    prisma.task.groupBy({ by: ["assigneeId"], where: { projectId }, _count: { _all: true }, orderBy: { assigneeId: "asc" } })
  ]);
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 10000) / 100;
  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    tasksByStatus: countMap(byStatus, "status"),
    tasksByPriority: countMap(byPriority, "priority"),
    tasksByAssignee: countMap(byAssignee, "assigneeId"),
    completionRate,
    averageCompletionTime: null,
    projectProgress: completionRate
  };
}

export async function teamAnalytics(userId: string, teamId: string) {
  await requireTeamRole(userId, teamId, TeamRole.VIEWER);
  const now = new Date();
  const [projectCount, memberCount, taskCount, completedTasks, overdueTasks, byStatus] = await prisma.$transaction([
    prisma.project.count({ where: { teamId } }),
    prisma.teamMember.count({ where: { teamId } }),
    prisma.task.count({ where: { project: { teamId } } }),
    prisma.task.count({ where: { project: { teamId }, status: TaskStatus.DONE } }),
    prisma.task.count({ where: { project: { teamId }, dueDate: { lt: now }, status: { not: TaskStatus.DONE } } }),
    prisma.task.groupBy({ by: ["status"], where: { project: { teamId } }, _count: { _all: true }, orderBy: { status: "asc" } })
  ]);
  return {
    projectCount,
    memberCount,
    taskCount,
    completedTasks,
    overdueTasks,
    completionRate: taskCount === 0 ? 0 : Math.round((completedTasks / taskCount) * 10000) / 100,
    tasksByStatus: countMap(byStatus, "status")
  };
}
