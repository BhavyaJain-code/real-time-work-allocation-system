import {
  PrismaClient,
  ProjectRole,
  ProjectStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

const PROJECTS = [
  {
    name: "AI Workforce Allocator",
    description:
      "Intelligent workforce allocation using employee skills, availability, and workload.",
    status: ProjectStatus.ACTIVE,
    duration: 45,
  },
  {
    name: "Employee Performance Analytics",
    description:
      "Analytics dashboard for employee productivity, workload, and performance trends.",
    status: ProjectStatus.ACTIVE,
    duration: 60,
  },
  {
    name: "Next Generation Task Manager",
    description:
      "Modern task management system with real-time updates and intelligent assignment.",
    status: ProjectStatus.ACTIVE,
    duration: 50,
  },
  {
    name: "Customer Experience Platform",
    description:
      "Platform for managing customer interactions, feedback, and service workflows.",
    status: ProjectStatus.PLANNING,
    duration: 75,
  },
  {
    name: "Cloud Infrastructure Migration",
    description:
      "Migration of internal infrastructure and services to a scalable cloud environment.",
    status: ProjectStatus.ACTIVE,
    duration: 90,
  },
  {
    name: "Cybersecurity Modernization",
    description:
      "Security modernization initiative covering monitoring, identity, and threat detection.",
    status: ProjectStatus.ON_HOLD,
    duration: 80,
  },
  {
    name: "Data Intelligence Hub",
    description:
      "Centralized analytics and machine learning platform for business intelligence.",
    status: ProjectStatus.ACTIVE,
    duration: 120,
  },
  {
    name: "Mobile Application Redesign",
    description:
      "Complete redesign of the company's mobile experience across iOS and Android.",
    status: ProjectStatus.PLANNING,
    duration: 65,
  },
  {
    name: "Automated QA Pipeline",
    description:
      "Automated testing infrastructure for continuous integration and deployment.",
    status: ProjectStatus.COMPLETED,
    duration: 40,
  },
  {
    name: "Operations Optimization",
    description:
      "Optimization of internal workflows, resource allocation, and operational processes.",
    status: ProjectStatus.ACTIVE,
    duration: 70,
  },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

async function main() {
  console.log("Creating project dataset...");

  /*
   * ---------------------------------------------------------
   * Find the workforce team
   * ---------------------------------------------------------
   */

  let team = await prisma.team.findFirst({
    where: {
      name: "Enterprise Workforce",
    },
  });

  /*
   * If the team does not exist, create it using a manager.
   */

  if (!team) {
    const manager = await prisma.user.findFirst({
      where: {
        role: UserRole.MANAGER,
      },
    });

    if (!manager) {
      throw new Error(
        "No manager found. Run seed-employees.ts first."
      );
    }

    team = await prisma.team.create({
      data: {
        name: "Enterprise Workforce",
        description:
          "Demo workforce for real-time allocation",
        ownerId: manager.id,
      },
    });

    console.log("Created Enterprise Workforce team.");
  }

  /*
   * ---------------------------------------------------------
   * Get users
   * ---------------------------------------------------------
   */

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: team.ownerId,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const managers = users.filter(
    (user) => user.role === UserRole.MANAGER
  );

  if (managers.length === 0) {
    throw new Error(
      "No managers found. Run seed-employees.ts first."
    );
  }

  if (users.length < 10) {
    throw new Error(
      "Not enough users found. Run seed-employees.ts first."
    );
  }

  /*
   * ---------------------------------------------------------
   * Make sure all users belong to the team
   * ---------------------------------------------------------
   */

  for (const user of users) {
    await prisma.teamMember.upsert({
      where: {
        teamId_userId: {
          teamId: team.id,
          userId: user.id,
        },
      },
      update: {},
      create: {
        teamId: team.id,
        userId: user.id,
        role:
          user.role === UserRole.MANAGER
            ? "MANAGER"
            : "MEMBER",
      },
    });
  }

  /*
   * ---------------------------------------------------------
   * Create projects
   * ---------------------------------------------------------
   */

  for (let i = 0; i < PROJECTS.length; i++) {
    const projectData = PROJECTS[i];

    /*
     * Do not create duplicate projects.
     */

    const existing = await prisma.project.findFirst({
      where: {
        name: projectData.name,
        teamId: team.id,
      },
    });

    if (existing) {
      console.log(
        `Skipping existing project: ${projectData.name}`
      );

      continue;
    }

    /*
     * Pick a random manager as project manager.
     */

    const projectManager =
      managers[i % managers.length];

    /*
     * Generate realistic dates.
     */

    const startDate = new Date();

    startDate.setDate(
      startDate.getDate() - randomInt(0, 30)
    );

    const dueDate = new Date(startDate);

    dueDate.setDate(
      dueDate.getDate() + projectData.duration
    );

    /*
     * Create project.
     */

    const project = await prisma.project.create({
      data: {
        teamId: team.id,
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        startDate,
        dueDate,
        createdById: projectManager.id,
      },
    });

    /*
     * ---------------------------------------------------------
     * Select 5–10 random users
     * ---------------------------------------------------------
     */

    const shuffledUsers = shuffle(users);

    const memberCount = randomInt(5, 10);

    const selectedUsers = shuffledUsers
      .filter(
        (user) => user.id !== projectManager.id
      )
      .slice(0, memberCount - 1);

    /*
     * Always include the project manager.
     */

    const projectUsers = [
      projectManager,
      ...selectedUsers,
    ];

    /*
     * Remove accidental duplicates.
     */

    const uniqueUsers = Array.from(
      new Map(
        projectUsers.map((user) => [
          user.id,
          user,
        ])
      ).values()
    );

    /*
     * ---------------------------------------------------------
     * Add project members
     * ---------------------------------------------------------
     */

    for (const user of uniqueUsers) {
      await prisma.projectMember.upsert({
        where: {
          projectId_userId: {
            projectId: project.id,
            userId: user.id,
          },
        },
        update: {
          role:
            user.id === projectManager.id
              ? ProjectRole.MANAGER
              : ProjectRole.MEMBER,
        },
        create: {
          projectId: project.id,
          userId: user.id,
          role:
            user.id === projectManager.id
              ? ProjectRole.MANAGER
              : ProjectRole.MEMBER,
        },
      });
    }

    console.log(
      `Created: ${project.name} | ${uniqueUsers.length} members | Manager: ${projectManager.name}`
    );
  }

  /*
   * ---------------------------------------------------------
   * Summary
   * ---------------------------------------------------------
   */

  const projectCount =
    await prisma.project.count({
      where: {
        teamId: team.id,
      },
    });

  console.log("");
  console.log("======================================");
  console.log("PROJECT DATASET COMPLETE");
  console.log("======================================");
  console.log(`Team: ${team.name}`);
  console.log(`Projects: ${projectCount}`);
  console.log("Each project has 5–10 members.");
  console.log("Existing data was NOT deleted.");
  console.log("======================================");
}

main()
  .catch((error) => {
    console.error("Project seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });