import { NotificationType, ProjectRole } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { errors } from "../../utils/appError";
import { assertTaskUser, requireProjectRole } from "../../middleware/authorization";
import { emitToProject, emitToUser } from "../../websocket/socket";

function extractMentions(content: string): string[] {
  return [...content.matchAll(/@\[([^\]]+)\]\(([^)]+)\)/g)].map((m) => m[2]);
}

export async function createComment(userId: string, taskId: string, content: string) {
  const task = await assertTaskUser(taskId, userId);
  await requireProjectRole(userId, task.projectId, ProjectRole.MEMBER);
  const result = await prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({ data: { taskId, userId, content }, include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } });
    await tx.activityLog.create({ data: { projectId: task.projectId, userId, action: "COMMENT_CREATED", entityType: "COMMENT", entityId: comment.id } });
    const targetIds = new Set<string>(extractMentions(content));
    const assignee = await tx.task.findUnique({ where: { id: taskId }, select: { assigneeId: true, title: true } });
    if (assignee?.assigneeId && assignee.assigneeId !== userId) targetIds.add(assignee.assigneeId);
    const notifications = await Promise.all([...targetIds].filter((id) => id !== userId).map((targetUserId) =>
      tx.notification.create({ data: { userId: targetUserId, type: NotificationType.COMMENT_ADDED, title: "New task comment", message: `Comment added to ${assignee?.title ?? "task"}`, data: { taskId, commentId: comment.id } } })
    ));
    return { comment, notifications };
  });
  emitToProject(task.projectId, "comment.created", result.comment);
  result.notifications.forEach((n) => emitToUser(n.userId, "notification.created", n));
  return result.comment;
}

export async function listComments(userId: string, taskId: string) {
  await assertTaskUser(taskId, userId);
  return prisma.comment.findMany({ where: { taskId }, include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } }, orderBy: { createdAt: "asc" } });
}

export async function updateComment(userId: string, commentId: string, content: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId }, include: { task: { select: { projectId: true } } } });
  if (!comment) throw errors.notFound("COMMENT_NOT_FOUND", "Comment not found");
  if (comment.userId !== userId) await requireProjectRole(userId, comment.task.projectId, ProjectRole.MANAGER);
  const updated = await prisma.comment.update({ where: { id: commentId }, data: { content }, include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } });
  emitToProject(comment.task.projectId, "comment.updated", updated);
  return updated;
}

export async function deleteComment(userId: string, commentId: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId }, include: { task: { select: { projectId: true } } } });
  if (!comment) throw errors.notFound("COMMENT_NOT_FOUND", "Comment not found");
  if (comment.userId !== userId) await requireProjectRole(userId, comment.task.projectId, ProjectRole.MANAGER);
  await prisma.comment.delete({ where: { id: commentId } });
  emitToProject(comment.task.projectId, "comment.deleted", { id: commentId });
}
