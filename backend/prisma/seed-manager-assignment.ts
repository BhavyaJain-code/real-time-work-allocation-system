import {
  PrismaClient,
  TeamRole,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(" Starting manager → employee assignments...");

  // =====================================================
  // GET EXISTING MANAGERS
  // =====================================================

  const managers = await prisma.user.findMany({
    where: {
      role: {
        in: [UserRole.MANAGER, UserRole.ADMIN],
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // =====================================================
  // GET NORMAL EMPLOYEES
  //
  // MEMBER users are treated as normal employees.
  // =====================================================

  const employees = await prisma.user.findMany({
    where: {
      role: UserRole.MEMBER,
    },
    orderBy: {
      name: "asc",
    },
  });

  console.log(`Found ${managers.length} managers.`);
  console.log(`Found ${employees.length} normal employees.`);

  if (managers.length === 0) {
    console.log(" No managers found.");
    return;
  }

  if (employees.length === 0) {
    console.log(" No normal employees found.");
    return;
  }

  // =====================================================
  // GET EXISTING TEAMS
  // =====================================================

  const teams = await prisma.team.findMany({
    include: {
      members: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (teams.length === 0) {
    console.log(" No teams found.");
    return;
  }

  console.log(`Found ${teams.length} teams.`);

  // =====================================================
  // ASSIGN EMPLOYEES
  //
  // Each manager gets 7–10 employees.
  //
  // We use the manager index + employee index to
  // distribute employees rather than giving every
  // manager exactly the same people.
  // =====================================================

  let totalAssignments = 0;

  for (let managerIndex = 0; managerIndex < managers.length; managerIndex++) {
    const manager = managers[managerIndex];

    // Deterministic 7–10 employees per manager.
    const employeeCount = 7 + (managerIndex % 4);

    console.log(
      `\n👤 Manager: ${manager.name} (${manager.email})`
    );

    // ---------------------------------------------------
    // Choose employees using a rotating starting point.
    // ---------------------------------------------------

    const selectedEmployees: typeof employees = [];

    for (
      let offset = 0;
      offset < employeeCount;
      offset++
    ) {
      const employeeIndex =
        (managerIndex * 7 + offset) %
        employees.length;

      const employee = employees[employeeIndex];

      if (
        employee &&
        !selectedEmployees.some(
          (selected) => selected.id === employee.id
        )
      ) {
        selectedEmployees.push(employee);
      }
    }

    // ---------------------------------------------------
    // Pick a team for this manager.
    //
    // Prefer a team where the manager is already a
    // member/manager/owner.
    // ---------------------------------------------------

    let managerTeam = teams.find((team) =>
      team.members.some(
        (member) =>
          member.userId === manager.id
      )
    );

    // If manager doesn't belong to a team yet,
    // use a rotating existing team.
    if (!managerTeam) {
      managerTeam =
        teams[managerIndex % teams.length];
    }

    // ---------------------------------------------------
    // Make sure manager belongs to the team.
    // ---------------------------------------------------

    const existingManagerMembership =
      await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: managerTeam.id,
            userId: manager.id,
          },
        },
      });

    if (!existingManagerMembership) {
      await prisma.teamMember.create({
        data: {
          teamId: managerTeam.id,
          userId: manager.id,
          role: TeamRole.MANAGER,
        },
      });

      console.log(
        `  + Added ${manager.name} as MANAGER of ${managerTeam.name}`
      );
    }

    // ---------------------------------------------------
    // Assign employees to the manager's team.
    // ---------------------------------------------------

    for (const employee of selectedEmployees) {
      const existingMembership =
        await prisma.teamMember.findUnique({
          where: {
            teamId_userId: {
              teamId: managerTeam.id,
              userId: employee.id,
            },
          },
        });

      if (existingMembership) {
        // Don't overwrite OWNER / ADMIN / MANAGER roles.
        if (
          existingMembership.role ===
          TeamRole.MEMBER
        ) {
          console.log(
            `  ✓ ${employee.name} already assigned`
          );
        } else {
          console.log(
            `  ✓ ${employee.name} already has role ${existingMembership.role}`
          );
        }

        continue;
      }

      await prisma.teamMember.create({
        data: {
          teamId: managerTeam.id,
          userId: employee.id,
          role: TeamRole.MEMBER,
        },
      });

      totalAssignments++;

      console.log(
        `  + ${employee.name} → ${managerTeam.name}`
      );
    }

    console.log(
      `  ${manager.name}: ${selectedEmployees.length} employees`
    );
  }

  // =====================================================
  // SUMMARY
  // =====================================================

  console.log("\n========================================");
  console.log("MANAGER ASSIGNMENTS COMPLETE");
  console.log("========================================");
  console.log(`Managers found: ${managers.length}`);
  console.log(`Employees found: ${employees.length}`);
  console.log(`New assignments: ${totalAssignments}`);
  console.log("========================================\n");

  // =====================================================
  // PRINT FINAL MANAGER → EMPLOYEE STRUCTURE
  // =====================================================

  for (const manager of managers) {
    const memberships =
      await prisma.teamMember.findMany({
        where: {
          team: {
            members: {
              some: {
                userId: manager.id,
              },
            },
          },
          role: TeamRole.MEMBER,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    console.log(
      `\n${manager.name} (${manager.email})`
    );

    if (memberships.length === 0) {
      console.log("  No employees assigned.");
      continue;
    }

    memberships.forEach(
      (membership, index) => {
        console.log(
          `  ${index + 1}. ${membership.user.name} — ${membership.team.name}`
        );
      }
    );
  }
}

main()
  .catch((error) => {
    console.error(
      " Manager assignment seed failed:",
      error
    );
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });