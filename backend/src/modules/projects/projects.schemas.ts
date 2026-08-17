import { ProjectRole, ProjectStatus } from "@prisma/client";
import { z } from "zod";
import { enumValues } from "../../utils/validation";

export const createProjectSchema = z.object({
  teamId: z.string().min(1),
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(enumValues(ProjectStatus)).optional(),
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional()
});

export const updateProjectSchema = createProjectSchema.omit({ teamId: true }).partial();

export const addProjectMemberSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(enumValues(ProjectRole)).default(ProjectRole.MEMBER)
});
