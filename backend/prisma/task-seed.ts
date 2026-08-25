import {
  PrismaClient,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const taskTitles = [
  "Implement core functionality",
  "Complete frontend integration",
  "Set up API endpoints",
  "Build database integration",
  "Create dashboard components",
  "Implement authentication flow",
  "Create responsive interface",
  "Add validation and error handling",
  "Implement real-time updates",
  "Perform integration testing",
  "Optimize application performance",
  "Prepare deployment configuration",
  "Create analytics module",
  "Implement notification system",
  "Complete documentation",
  "Run final quality checks",
  "Build user management",
  "Implement search functionality",
  "Create reporting module",
  "Finalize production release",
];

const taskDescriptions = [
  "Complete the implementation and verify that the feature works correctly.",
  "Build and integrate the required functionality with the existing system.",
  "Implement the required components and connect them to the backend.",
  "Finish the development work and perform basic testing.",
  "Ensure the feature is stable, responsive, and ready for review.",
];

const statuses = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
  TaskStatus.BLOCKED,
];

const priorities = [
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH,
  TaskPriority.CRITICAL,
];

async function main() {
  console.log("Starting task seed...");

  // Get all existing projects
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      createdById: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (projects.length === 0) {
    console.log("No projects found. Nothing to seed.");
    return;
  }

  console.log(`Found ${projects.length} projects.`);

  let createdCount = 0;
  let taskIndex = 0;

  for (const project of projects) {
    // Get ONLY members belonging to this project
    const members = await prisma.projectMember.findMany({
      where: {
        projectId: project.id,
      },
      select: {
        userId: true,
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    if (members.length === 0) {
      console.log(
        `Skipping "${project.name}" — no project members found.`
      );
      continue;
    }

    console.log(
      `Creating 2 tasks for "${project.name}" using ${members.length} project members...`
    );

    // Two tasks per project
    for (let i = 0; i < 2; i++) {
      const assignee =
        members[(taskIndex + i) % members.length];

      await prisma.task.create({
        data: {
          projectId: project.id,

          title:
            taskTitles[taskIndex % taskTitles.length],

          description:
            taskDescriptions[
              taskIndex % taskDescriptions.length
            ],

          status:
            statuses[taskIndex % statuses.length],

          priority:
            priorities[taskIndex % priorities.length],

          // Assignee is guaranteed to be
          // a member of this project
          assigneeId: assignee.userId,

          createdById: project.createdById,

          dueDate: new Date(
            Date.now() +
              ((taskIndex % 14) + 1) *
                24 *
                60 *
                60 *
                1000
          ),

          position: i,
        },
      });

      createdCount++;
      taskIndex++;
    }
  }

  console.log("");
  console.log("================================");
  console.log("Task seed complete.");
  console.log(`Projects found: ${projects.length}`);
  console.log(`Tasks created: ${createdCount}`);
  console.log("================================");
}

main()
  .catch((error) => {
    console.error("Task seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });