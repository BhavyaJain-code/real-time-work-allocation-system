import bcrypt from "bcrypt";
import { PrismaClient, UserRole, TeamRole } from "@prisma/client";

const prisma = new PrismaClient();

type EmployeeSeed = {
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  role: UserRole;
};

const managers: EmployeeSeed[] = [
  { firstName: "Arjun", lastName: "Mehta", department: "Engineering", position: "Engineering Manager", role: UserRole.MANAGER },
  { firstName: "Sophia", lastName: "Williams", department: "Engineering", position: "Engineering Manager", role: UserRole.MANAGER },
  { firstName: "Rahul", lastName: "Kapoor", department: "Product", position: "Product Manager", role: UserRole.MANAGER },
  { firstName: "Emma", lastName: "Thompson", department: "Design", position: "Design Manager", role: UserRole.MANAGER },
  { firstName: "Vikram", lastName: "Shah", department: "Data", position: "Data Science Manager", role: UserRole.MANAGER },
  { firstName: "Olivia", lastName: "Martin", department: "Marketing", position: "Marketing Manager", role: UserRole.MANAGER },
  { firstName: "Karan", lastName: "Malhotra", department: "DevOps", position: "DevOps Manager", role: UserRole.MANAGER },
  { firstName: "Isabella", lastName: "Anderson", department: "Finance", position: "Finance Manager", role: UserRole.MANAGER },
  { firstName: "Rohan", lastName: "Bhatia", department: "QA", position: "QA Manager", role: UserRole.MANAGER },
  { firstName: "Charlotte", lastName: "Robinson", department: "Operations", position: "Operations Manager", role: UserRole.MANAGER },
  { firstName: "Aditya", lastName: "Verma", department: "Security", position: "Security Manager", role: UserRole.MANAGER },
];

const employees: EmployeeSeed[] = [
  { firstName: "Neha", lastName: "Sharma", department: "Engineering", position: "Frontend Developer", role: UserRole.MEMBER },
  { firstName: "Aarav", lastName: "Patel", department: "Engineering", position: "Backend Developer", role: UserRole.MEMBER },
  { firstName: "Ishita", lastName: "Gupta", department: "Engineering", position: "Full Stack Developer", role: UserRole.MEMBER },
  { firstName: "Kabir", lastName: "Singh", department: "Engineering", position: "Software Engineer", role: UserRole.MEMBER },
  { firstName: "Ananya", lastName: "Mishra", department: "Engineering", position: "Frontend Developer", role: UserRole.MEMBER },
  { firstName: "Yash", lastName: "Agarwal", department: "Engineering", position: "Backend Developer", role: UserRole.MEMBER },
  { firstName: "Meera", lastName: "Nair", department: "Engineering", position: "Software Engineer", role: UserRole.MEMBER },
  { firstName: "Dev", lastName: "Joshi", department: "Engineering", position: "Full Stack Developer", role: UserRole.MEMBER },
  { firstName: "Riya", lastName: "Chopra", department: "Engineering", position: "Software Engineer", role: UserRole.MEMBER },

  { firstName: "Aanya", lastName: "Iyer", department: "Product", position: "Product Analyst", role: UserRole.MEMBER },
  { firstName: "Dhruv", lastName: "Reddy", department: "Product", position: "Product Specialist", role: UserRole.MEMBER },
  { firstName: "Tanya", lastName: "Khanna", department: "Product", position: "Product Analyst", role: UserRole.MEMBER },
  { firstName: "Aryan", lastName: "Sethi", department: "Product", position: "Business Analyst", role: UserRole.MEMBER },
  { firstName: "Kiara", lastName: "Bansal", department: "Product", position: "Product Associate", role: UserRole.MEMBER },
  { firstName: "Manav", lastName: "Arora", department: "Product", position: "Business Analyst", role: UserRole.MEMBER },
  { firstName: "Simran", lastName: "Kaur", department: "Product", position: "Product Specialist", role: UserRole.MEMBER },
  { firstName: "Nikhil", lastName: "Saxena", department: "Product", position: "Product Analyst", role: UserRole.MEMBER },

  { firstName: "Anika", lastName: "Bose", department: "Design", position: "UI Designer", role: UserRole.MEMBER },
  { firstName: "Reyansh", lastName: "Roy", department: "Design", position: "UX Designer", role: UserRole.MEMBER },
  { firstName: "Sara", lastName: "Dutta", department: "Design", position: "Product Designer", role: UserRole.MEMBER },
  { firstName: "Ayaan", lastName: "Sen", department: "Design", position: "UX Researcher", role: UserRole.MEMBER },
  { firstName: "Myra", lastName: "Das", department: "Design", position: "UI Designer", role: UserRole.MEMBER },
  { firstName: "Vihaan", lastName: "Ghosh", department: "Design", position: "Visual Designer", role: UserRole.MEMBER },
  { firstName: "Saanvi", lastName: "Banerjee", department: "Design", position: "UX Designer", role: UserRole.MEMBER },
  { firstName: "Advik", lastName: "Mukherjee", department: "Design", position: "Product Designer", role: UserRole.MEMBER },

  { firstName: "Ira", lastName: "Kulkarni", department: "Data", position: "Data Analyst", role: UserRole.MEMBER },
  { firstName: "Rehan", lastName: "Khan", department: "Data", position: "Data Scientist", role: UserRole.MEMBER },
  { firstName: "Nisha", lastName: "Menon", department: "Data", position: "Data Analyst", role: UserRole.MEMBER },
  { firstName: "Arnav", lastName: "Pillai", department: "Data", position: "ML Engineer", role: UserRole.MEMBER },
  { firstName: "Kavya", lastName: "Rao", department: "Data", position: "Data Engineer", role: UserRole.MEMBER },
  { firstName: "Vivaan", lastName: "Desai", department: "Data", position: "Data Scientist", role: UserRole.MEMBER },
  { firstName: "Shreya", lastName: "Vora", department: "Data", position: "Data Analyst", role: UserRole.MEMBER },
  { firstName: "Rudra", lastName: "Jain", department: "Data", position: "ML Engineer", role: UserRole.MEMBER },

  { firstName: "Maya", lastName: "Brown", department: "Marketing", position: "Marketing Specialist", role: UserRole.MEMBER },
  { firstName: "Liam", lastName: "Johnson", department: "Marketing", position: "Content Strategist", role: UserRole.MEMBER },
  { firstName: "Zoya", lastName: "Ali", department: "Marketing", position: "Social Media Specialist", role: UserRole.MEMBER },
  { firstName: "Noah", lastName: "Davis", department: "Marketing", position: "Growth Specialist", role: UserRole.MEMBER },
  { firstName: "Avni", lastName: "Sood", department: "Marketing", position: "SEO Specialist", role: UserRole.MEMBER },
  { firstName: "Ethan", lastName: "Miller", department: "Marketing", position: "Content Writer", role: UserRole.MEMBER },
  { firstName: "Mahi", lastName: "Tiwari", department: "Marketing", position: "Marketing Analyst", role: UserRole.MEMBER },

  { firstName: "Siddharth", lastName: "Bajaj", department: "DevOps", position: "Cloud Engineer", role: UserRole.MEMBER },
  { firstName: "Mira", lastName: "Thomas", department: "DevOps", position: "DevOps Engineer", role: UserRole.MEMBER },
  { firstName: "Aman", lastName: "Yadav", department: "DevOps", position: "Site Reliability Engineer", role: UserRole.MEMBER },
  { firstName: "Elena", lastName: "Garcia", department: "DevOps", position: "Cloud Engineer", role: UserRole.MEMBER },
  { firstName: "Harsh", lastName: "Bhardwaj", department: "DevOps", position: "Infrastructure Engineer", role: UserRole.MEMBER },
  { firstName: "Lucas", lastName: "Wilson", department: "DevOps", position: "DevOps Engineer", role: UserRole.MEMBER },
  { firstName: "Pooja", lastName: "Chawla", department: "DevOps", position: "Cloud Engineer", role: UserRole.MEMBER },

  { firstName: "Aisha", lastName: "Khan", department: "Finance", position: "Financial Analyst", role: UserRole.MEMBER },
  { firstName: "Ryan", lastName: "Taylor", department: "Finance", position: "Finance Associate", role: UserRole.MEMBER },
  { firstName: "Sakshi", lastName: "Mehra", department: "Finance", position: "Financial Analyst", role: UserRole.MEMBER },
  { firstName: "Henry", lastName: "Moore", department: "Finance", position: "Accounts Analyst", role: UserRole.MEMBER },
  { firstName: "Nandini", lastName: "Gupta", department: "Finance", position: "Finance Associate", role: UserRole.MEMBER },
  { firstName: "James", lastName: "Taylor", department: "Finance", position: "Financial Analyst", role: UserRole.MEMBER },
  { firstName: "Ishaan", lastName: "Walia", department: "Finance", position: "Risk Analyst", role: UserRole.MEMBER },

  { firstName: "Kritika", lastName: "Suri", department: "QA", position: "QA Engineer", role: UserRole.MEMBER },
  { firstName: "Owen", lastName: "Clark", department: "QA", position: "Test Engineer", role: UserRole.MEMBER },
  { firstName: "Rhea", lastName: "Malik", department: "QA", position: "QA Analyst", role: UserRole.MEMBER },
  { firstName: "Jacob", lastName: "Lewis", department: "QA", position: "Automation Engineer", role: UserRole.MEMBER },
  { firstName: "Anvi", lastName: "Kapoor", department: "QA", position: "QA Engineer", role: UserRole.MEMBER },
  { firstName: "Mason", lastName: "Walker", department: "QA", position: "Test Engineer", role: UserRole.MEMBER },
  { firstName: "Tanvi", lastName: "Shah", department: "QA", position: "QA Analyst", role: UserRole.MEMBER },

  { firstName: "Naina", lastName: "Verma", department: "Operations", position: "Operations Analyst", role: UserRole.MEMBER },
  { firstName: "Logan", lastName: "Hall", department: "Operations", position: "Operations Associate", role: UserRole.MEMBER },
  { firstName: "Rashi", lastName: "Bhat", department: "Operations", position: "Process Analyst", role: UserRole.MEMBER },
  { firstName: "Benjamin", lastName: "Young", department: "Operations", position: "Operations Analyst", role: UserRole.MEMBER },
  { firstName: "Palak", lastName: "Ahuja", department: "Operations", position: "Operations Associate", role: UserRole.MEMBER },
  { firstName: "William", lastName: "King", department: "Operations", position: "Process Analyst", role: UserRole.MEMBER },
  { firstName: "Muskan", lastName: "Jain", department: "Operations", position: "Operations Analyst", role: UserRole.MEMBER },

  { firstName: "Anmol", lastName: "Saini", department: "Security", position: "Security Analyst", role: UserRole.MEMBER },
  { firstName: "Grace", lastName: "Scott", department: "Security", position: "Cybersecurity Analyst", role: UserRole.MEMBER },
  { firstName: "Parth", lastName: "Goel", department: "Security", position: "Security Engineer", role: UserRole.MEMBER },
  { firstName: "Chloe", lastName: "Green", department: "Security", position: "Security Analyst", role: UserRole.MEMBER },
  { firstName: "Ayush", lastName: "Ahuja", department: "Security", position: "SOC Analyst", role: UserRole.MEMBER },
  { firstName: "Daniel", lastName: "Adams", department: "Security", position: "Security Engineer", role: UserRole.MEMBER },
  { firstName: "Ishika", lastName: "Batra", department: "Security", position: "Cybersecurity Analyst", role: UserRole.MEMBER },

  { firstName: "Sanya", lastName: "Arora", department: "Engineering", position: "Mobile Developer", role: UserRole.MEMBER },
  { firstName: "Aarush", lastName: "Mittal", department: "Engineering", position: "Software Engineer", role: UserRole.MEMBER },
  { firstName: "Diya", lastName: "Bhalla", department: "Engineering", position: "Frontend Developer", role: UserRole.MEMBER },
  { firstName: "Krish", lastName: "Bansal", department: "Engineering", position: "Backend Developer", role: UserRole.MEMBER },
  { firstName: "Navya", lastName: "Sethi", department: "Engineering", position: "Full Stack Developer", role: UserRole.MEMBER },
  { firstName: "Abeer", lastName: "Khanna", department: "Engineering", position: "Software Engineer", role: UserRole.MEMBER },
  { firstName: "Prisha", lastName: "Chawla", department: "Engineering", position: "Mobile Developer", role: UserRole.MEMBER },
  { firstName: "Veer", lastName: "Rajput", department: "Engineering", position: "Backend Developer", role: UserRole.MEMBER },
  { firstName: "Anushka", lastName: "Singh", department: "Engineering", position: "Software Engineer", role: UserRole.MEMBER },

  { firstName: "Samar", lastName: "Khanna", department: "Data", position: "Data Engineer", role: UserRole.MEMBER },
  { firstName: "Aditi", lastName: "Bhatia", department: "Data", position: "Data Analyst", role: UserRole.MEMBER },
  { firstName: "Yuvraj", lastName: "Malik", department: "Data", position: "ML Engineer", role: UserRole.MEMBER },
  { firstName: "Alina", lastName: "Sharma", department: "Design", position: "UX Designer", role: UserRole.MEMBER },
  { firstName: "Esha", lastName: "Kapoor", department: "Design", position: "UI Designer", role: UserRole.MEMBER },
  { firstName: "Arya", lastName: "Nanda", department: "Product", position: "Product Analyst", role: UserRole.MEMBER },
  { firstName: "Kiaan", lastName: "Suri", department: "Product", position: "Business Analyst", role: UserRole.MEMBER },
  { firstName: "Madhav", lastName: "Rao", department: "QA", position: "QA Engineer", role: UserRole.MEMBER },
  { firstName: "Aarohi", lastName: "Deshmukh", department: "Operations", position: "Operations Analyst", role: UserRole.MEMBER },
];

const allUsers = [...managers, ...employees];

function makePassword(firstName: string, lastName: string) {
  return (
    firstName.slice(0, 3) +
    lastName.slice(0, 3) +
    "WF"
  );
}

function makeEmail(firstName: string, lastName: string, index: number) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@workflow.local`;
}

async function main() {
  console.log("Creating employee dataset...");
  console.log(`Total users: ${allUsers.length}`);
  console.log(`Managers: ${managers.length}`);
  console.log(`Employees: ${employees.length}`);

  const passwordCache = new Map<string, string>();

  /*
   * ---------------------------------------------------------
   * Create users
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   * No deleteMany().
   * Existing users remain untouched.
   */

  const createdUsers = [];

  for (let i = 0; i < allUsers.length; i++) {
    const person = allUsers[i];

    const email = makeEmail(
      person.firstName,
      person.lastName,
      i + 1
    );

    const password = makePassword(
      person.firstName,
      person.lastName
    );

    passwordCache.set(email, password);

    const passwordHash = await bcrypt.hash(password, 12);

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`Skipping existing user: ${email}`);

      createdUsers.push(existing);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        name: `${person.firstName} ${person.lastName}`,
        email,
        passwordHash,
        role: person.role,
      },
    });

    createdUsers.push(user);

    console.log(
      `Created ${person.role}: ${user.name} (${email})`
    );
  }

  /*
   * ---------------------------------------------------------
   * Create a demo team
   * ---------------------------------------------------------
   */

  const managerUsers = createdUsers.filter(
    (user) => user.role === UserRole.MANAGER
  );

  let team = await prisma.team.findFirst({
    where: {
      name: "Enterprise Workforce",
    },
  });

  if (!team && managerUsers.length > 0) {
    team = await prisma.team.create({
      data: {
        name: "Enterprise Workforce",
        description:
          "Demo workforce for real-time allocation",
        ownerId: managerUsers[0].id,
      },
    });

    console.log("Created Enterprise Workforce team.");
  }

  /*
   * ---------------------------------------------------------
   * Add users to the demo team
   * ---------------------------------------------------------
   */

  if (team) {
    for (const user of createdUsers) {
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
              ? TeamRole.MANAGER
              : TeamRole.MEMBER,
        },
      });
    }

    console.log(
      `Added ${createdUsers.length} users to Enterprise Workforce.`
    );
  }

  /*
   * ---------------------------------------------------------
   * Print login credentials
   * ---------------------------------------------------------
   */

  console.log("\n========================================");
  console.log("EMPLOYEE LOGIN CREDENTIALS");
  console.log("========================================");

  for (const user of createdUsers) {
    const password = passwordCache.get(user.email);

    if (!password) continue;

    console.log(
      `${user.name.padEnd(25)} | ${user.email.padEnd(42)} | ${password}`
    );
  }

  console.log("========================================");
  console.log("Employee dataset creation complete.");
  console.log(`Users created/available: ${createdUsers.length}`);
  console.log(`Managers: ${managers.length}`);
  console.log(`Employees: ${employees.length}`);
}

main()
  .catch((error) => {
    console.error("Employee seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });