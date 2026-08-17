import bcrypt from "bcrypt";
import { NotificationType, PrismaClient, ProjectRole, Task, TaskPriority, TaskStatus, TeamRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.refreshToken.deleteMany(),
    prisma.attachment.deleteMany(),
    prisma.activityLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.task.deleteMany(),
    prisma.projectMember.deleteMany(),
    prisma.project.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.team.deleteMany(),
    prisma.user.deleteMany()
  ]);

  const passwordHash = await bcrypt.hash("Password123!", 12);
  const users = await Promise.all(
    ["Aditi Rao", "Ben Carter", "Chen Li", "Dana Brooks", "Eva Singh"].map((name, index) =>
      prisma.user.create({
        data: { name, email: `dev${index + 1}@example.com`, passwordHash, avatarUrl: `https://i.pravatar.cc/150?u=dev${index + 1}` }
      })
    )
  );

  const platform = await prisma.team.create({ data: { name: "Platform Operations", description: "Core delivery and allocation", ownerId: users[0].id } });
  const growth = await prisma.team.create({ data: { name: "Growth Delivery", description: "Customer-facing execution", ownerId: users[1].id } });

  await prisma.teamMember.createMany({
    data: [
      { teamId: platform.id, userId: users[0].id, role: TeamRole.OWNER },
      { teamId: platform.id, userId: users[1].id, role: TeamRole.ADMIN },
      { teamId: platform.id, userId: users[2].id, role: TeamRole.MANAGER },
      { teamId: platform.id, userId: users[3].id, role: TeamRole.MEMBER },
      { teamId: growth.id, userId: users[1].id, role: TeamRole.OWNER },
      { teamId: growth.id, userId: users[0].id, role: TeamRole.ADMIN },
      { teamId: growth.id, userId: users[4].id, role: TeamRole.MEMBER }
    ]
  });

  const projects = await Promise.all([
    prisma.project.create({ data: { teamId: platform.id, name: "Allocator Engine", description: "Real-time workload allocation", status: "ACTIVE", createdById: users[0].id, startDate: new Date(), dueDate: new Date(Date.now() + 21 * 86400000) } }),
    prisma.project.create({ data: { teamId: platform.id, name: "Kanban Experience", description: "Task boards and status flows", status: "ACTIVE", createdById: users[0].id } }),
    prisma.project.create({ data: { teamId: growth.id, name: "Customer Rollout", description: "Pilot onboarding", status: "PLANNING", createdById: users[1].id } })
  ]);

  for (const project of projects) {
    await prisma.projectMember.createMany({
      data: users.slice(0, project.teamId === platform.id ? 4 : 5).map((user, index) => ({
        projectId: project.id,
        userId: user.id,
        role: index === 0 ? ProjectRole.MANAGER : ProjectRole.MEMBER
      })),
      skipDuplicates: true
    });
  }

  const createdTasks: Task[] = [];
  for (let i = 0; i < 24; i += 1) {
    const project = projects[i % projects.length];
    const task = await prisma.task.create({
      data: {
        projectId: project.id,
        title: `Delivery task ${i + 1}`,
        description: `Implementation work item ${i + 1}`,
        status: [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskStatus.DONE, TaskStatus.BLOCKED][i % 5],
        priority: [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.CRITICAL][i % 4],
        assigneeId: users[i % users.length].id,
        createdById: users[0].id,
        dueDate: new Date(Date.now() + (i - 4) * 86400000),
        position: i
      }
    });
    createdTasks.push(task);
  }

  await prisma.task.createMany({
    data: createdTasks.slice(0, 6).map((task, index) => ({
      projectId: task.projectId,
      parentTaskId: task.id,
      title: `Subtask ${index + 1}`,
      description: "Nested execution detail",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      createdById: users[0].id,
      position: index
    }))
  });

  await prisma.comment.createMany({
    data: createdTasks.slice(0, 10).map((task, index) => ({
      taskId: task.id,
      userId: users[index % users.length].id,
      content: `Progress update ${index + 1}`
    }))
  });

  await prisma.notification.createMany({
    data: users.map((user) => ({
      userId: user.id,
      type: NotificationType.SYSTEM,
      title: "Development seed loaded",
      message: "Seed data is ready for local development.",
      data: { seeded: true }
    }))
  });

  await prisma.activityLog.createMany({
    data: projects.flatMap((project) => [
      { projectId: project.id, userId: project.createdById, action: "PROJECT_CREATED", entityType: "PROJECT", entityId: project.id },
      { projectId: project.id, userId: project.createdById, action: "TASK_CREATED", entityType: "TASK", entityId: createdTasks.find((task) => task.projectId === project.id)?.id ?? project.id }
    ])
  });

  console.log("Seed complete. Development users: dev1@example.com through dev5@example.com, password Password123!");
}

main().finally(async () => prisma.$disconnect());
