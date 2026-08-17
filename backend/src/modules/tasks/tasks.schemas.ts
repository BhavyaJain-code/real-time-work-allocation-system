import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";
import { enumValues, paginationQuery } from "../../utils/validation";

export const createTaskSchema = z.object({
  projectId: z.string().min(1),
  parentTaskId: z.string().min(1).nullable().optional(),
  title: z.string().trim().min(1).max(250),
  description: z.string().trim().max(5000).optional(),
  status: z.enum(enumValues(TaskStatus)).optional(),
  priority: z.enum(enumValues(TaskPriority)).optional(),
  assigneeId: z.string().min(1).nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
  position: z.number().int().nonnegative().optional()
});

export const updateTaskSchema = createTaskSchema.omit({ projectId: true, parentTaskId: true }).partial();

export const reorderTaskSchema = z.object({
  status: z.enum(enumValues(TaskStatus)).optional(),
  position: z.number().int().nonnegative()
});

export const taskQuerySchema = paginationQuery.extend({
  projectId: z.string().min(1).optional(),
  assigneeId: z.string().min(1).optional(),
  status: z.enum(enumValues(TaskStatus)).optional(),
  priority: z.enum(enumValues(TaskPriority)).optional(),
  dueBefore: z.coerce.date().optional(),
  dueAfter: z.coerce.date().optional(),
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "dueDate", "position", "priority", "status"]).default("position"),
  sortOrder: z.enum(["asc", "desc"]).default("asc")
});
