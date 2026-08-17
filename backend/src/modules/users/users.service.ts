import { prisma } from "../../prisma/client";
import { errors } from "../../utils/appError";
import { sanitizeUser } from "../../utils/sanitize";

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw errors.notFound("USER_NOT_FOUND", "User not found");
  return sanitizeUser(user);
}

export async function updateProfile(userId: string, data: { name?: string; avatarUrl?: string | null }) {
  const user = await prisma.user.update({ where: { id: userId }, data });
  return sanitizeUser(user);
}
