import { TeamRole } from "@prisma/client";
import { z } from "zod";
import { enumValues } from "../../utils/validation";

export const createTeamSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional()
});

export const updateTeamSchema = createTeamSchema.partial();

export const addTeamMemberSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(enumValues(TeamRole)).default(TeamRole.MEMBER)
});

export const updateTeamMemberSchema = z.object({
  role: z.enum(enumValues(TeamRole))
});
