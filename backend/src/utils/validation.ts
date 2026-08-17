import { z } from "zod";

export const idParam = z.object({ id: z.string().min(1) });
export const userIdParam = z.object({ id: z.string().min(1), userId: z.string().min(1) });
export const taskIdParam = z.object({ taskId: z.string().min(1) });
export const commentIdParam = z.object({ id: z.string().min(1) });
export const projectIdParam = z.object({ projectId: z.string().min(1) });
export const teamIdParam = z.object({ teamId: z.string().min(1) });

export const paginationQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});

export function enumValues<T extends Record<string, string>>(value: T): [T[keyof T], ...T[keyof T][]] {
  return Object.values(value) as [T[keyof T], ...T[keyof T][]];
}
