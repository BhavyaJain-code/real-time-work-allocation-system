import { ProjectRole } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { requireProjectRole } from "../../middleware/authorization";

export async function listProjectActivity(userId: string, projectId: string) {
  await requireProjectRole(userId, projectId, ProjectRole.VIEWER);
  return prisma.activityLog.findMany({
    where: { projectId },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    orderBy: { createdAt: "desc" },
    take: 200
  });
}
