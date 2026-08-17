import { NotificationType, Prisma, ProjectRole, TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { errors } from "../../utils/appError";
import { assertProjectUser, requireProjectRole } from "../../middleware/authorization";
import { emitToProject, emitToUser } from "../../websocket/socket";

type CreateTask = {
  projectId: string;
  parentTaskId?: string | null;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  dueDate?: Date | null;
  position?: number;
};

type UpdateTask = Partial<Omit<CreateTask, "projectId" | "parentTaskId">>;

async function assertAssignee(projectId: string, assigneeId?: string | null): Promise<void> {
  if (assigneeId) await assertProjectUser(projectId, assigneeId);
}

async function notifyAssignment(tx: Prisma.TransactionClient, taskId: string, assigneeId: string, title: string) {
  const notification = await tx.notification.create({
    data: {
      userId: assigneeId,
      type: NotificationType.TASK_ASSIGNED,
      title: "Task assigned",
      message: `You were assigned: ${title}`,
      data: { taskId }
    }
  });
  return notification;
}

export async function createTask(userId: string, data: CreateTask) {
  await requireProjectRole(userId, data.projectId, ProjectRole.MEMBER);
  await assertAssignee(data.projectId, data.assigneeId);
  if (data.parentTaskId) {
    const parent = await prisma.task.findUnique({ where: { id: data.parentTaskId }, select: { projectId: true } });
    if (!parent || parent.projectId !== data.projectId) throw errors.notFound("PARENT_TASK_NOT_FOUND", "Parent task not found in project");
  }
  const result = await prisma.$transaction(async (tx) => {
    const position =
      data.position ??
      ((await tx.task.aggregate({ where: { projectId: data.projectId, parentTaskId: data.parentTaskId ?? null }, _max: { position: true } }))._max.position ?? -1) + 1;
    const task = await tx.task.create({
      data: { ...data, position, createdById: userId }
    });
    await tx.activityLog.create({ data: { projectId: data.projectId, userId, action: "TASK_CREATED", entityType: "TASK", entityId: task.id } });
    const notification = data.assigneeId ? await notifyAssignment(tx, task.id, data.assigneeId, task.title) : undefined;
    return { task, notification };
  });
  emitToProject(data.projectId, "task.created", result.task);
  if (result.notification && data.assigneeId) emitToUser(data.assigneeId, "notification.created", result.notification);
  return result.task;
}

export async function listTasks(userId: string, query: {
  page: number; limit: number; projectId?: string; assigneeId?: string; status?: TaskStatus; priority?: TaskPriority; dueBefore?: Date; dueAfter?: Date; search?: string; sortBy: string; sortOrder: "asc" | "desc";
}) {
  const projectFilter = query.projectId ? { projectId: query.projectId } : { project: { members: { some: { userId } } } };
  if (query.projectId) await assertProjectUser(query.projectId, userId);
  const where: Prisma.TaskWhereInput = {
    ...projectFilter,
    assigneeId: query.assigneeId,
    status: query.status,
    priority: query.priority,
    dueDate: query.dueBefore || query.dueAfter ? { lte: query.dueBefore, gte: query.dueAfter } : undefined,
    OR: query.search
      ? [{ title: { contains: query.search, mode: "insensitive" } }, { description: { contains: query.search, mode: "insensitive" } }]
      : undefined
  };
  const [total, items] = await prisma.$transaction([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      include: { assignee: { select: { id: true, name: true, email: true, avatarUrl: true } }, createdBy: { select: { id: true, name: true, email: true } }, _count: { select: { subtasks: true, comments: true } } },
      orderBy: { [query.sortBy]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit
    })
  ]);
  return { items, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } };
}

export async function getTask(userId: string, taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { subtasks: true, comments: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } }, assignee: { select: { id: true, name: true, email: true, avatarUrl: true } } }
  });
  if (!task) throw errors.notFound("TASK_NOT_FOUND", "Task not found");
  await assertProjectUser(task.projectId, userId);
  return task;
}

export async function updateTask(userId: string, taskId: string, data: UpdateTask) {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw errors.notFound("TASK_NOT_FOUND", "Task not found");
  await requireProjectRole(userId, existing.projectId, ProjectRole.MEMBER);
  await assertAssignee(existing.projectId, data.assigneeId);
  const result = await prisma.$transaction(async (tx) => {
    const task = await tx.task.update({ where: { id: taskId }, data });
    const action = data.assigneeId && data.assigneeId !== existing.assigneeId ? "TASK_ASSIGNED" : data.status && data.status !== existing.status ? "TASK_STATUS_CHANGED" : "TASK_UPDATED";
    await tx.activityLog.create({
      data: {
        projectId: existing.projectId,
        userId,
        action,
        entityType: "TASK",
        entityId: taskId,
        metadata: { previousStatus: existing.status, newStatus: task.status, previousAssigneeId: existing.assigneeId, newAssigneeId: task.assigneeId }
      }
    });
    const notification =
      data.assigneeId && data.assigneeId !== existing.assigneeId ? await notifyAssignment(tx, task.id, data.assigneeId, task.title) : undefined;
    return { task, action, notification };
  });
  emitToProject(existing.projectId, result.action === "TASK_ASSIGNED" ? "task.assigned" : result.action === "TASK_STATUS_CHANGED" ? "task.status_changed" : "task.updated", result.task);
  if (result.notification && data.assigneeId) emitToUser(data.assigneeId, "notification.created", result.notification);
  return result.task;
}

export async function deleteTask(userId: string, taskId: string) {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw errors.notFound("TASK_NOT_FOUND", "Task not found");
  await requireProjectRole(userId, existing.projectId, ProjectRole.MEMBER);
  await prisma.$transaction(async (tx) => {
    await tx.task.delete({ where: { id: taskId } });
    await tx.activityLog.create({ data: { projectId: existing.projectId, userId, action: "TASK_DELETED", entityType: "TASK", entityId: taskId } });
  });
  emitToProject(existing.projectId, "task.deleted", { id: taskId });
}

export async function createSubtask(userId: string, taskId: string, data: Omit<CreateTask, "projectId" | "parentTaskId">) {
  const parent = await prisma.task.findUnique({ where: { id: taskId }, select: { projectId: true } });
  if (!parent) throw errors.notFound("TASK_NOT_FOUND", "Task not found");
  return createTask(userId, { ...data, projectId: parent.projectId, parentTaskId: taskId });
}

export async function listSubtasks(userId: string, taskId: string) {
  const parent = await prisma.task.findUnique({ where: { id: taskId }, select: { projectId: true } });
  if (!parent) throw errors.notFound("TASK_NOT_FOUND", "Task not found");
  await assertProjectUser(parent.projectId, userId);
  return prisma.task.findMany({ where: { parentTaskId: taskId }, orderBy: { position: "asc" } });
}

export async function reorderTask(userId: string, taskId: string, data: { status?: TaskStatus; position: number }) {
  const existing = await prisma.task.findUnique({ where: { id: taskId } });
  if (!existing) throw errors.notFound("TASK_NOT_FOUND", "Task not found");
  await requireProjectRole(userId, existing.projectId, ProjectRole.MEMBER);
  const task = await prisma.$transaction(async (tx) => {
    const siblings = await tx.task.findMany({
      where: { projectId: existing.projectId, parentTaskId: existing.parentTaskId, status: data.status ?? existing.status, id: { not: taskId } },
      orderBy: { position: "asc" },
      select: { id: true }
    });
    const reordered = [...siblings];
    reordered.splice(data.position, 0, { id: taskId });
    await Promise.all(reordered.map((item, index) => tx.task.update({ where: { id: item.id }, data: { position: index } })));
    const updated = await tx.task.update({ where: { id: taskId }, data: { status: data.status, position: data.position } });
    await tx.activityLog.create({ data: { projectId: existing.projectId, userId, action: "TASK_REORDERED", entityType: "TASK", entityId: taskId, metadata: data } });
    return updated;
  });
  emitToProject(existing.projectId, "task.reordered", task);
  return task;
}
