import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
  SEPARATE USER -> SKILL SEED

  This file:
  - does NOT create users
  - does NOT delete users
  - does NOT create skills
  - does NOT delete skills
  - only creates missing UserSkill relationships

  Run:
    npx tsx prisma/seed-user-skills.ts
*/

const positionSkills: Record<string, string[]> = {
  "Frontend Developer": ["React","TypeScript","JavaScript","HTML","CSS","Git","GitHub","Debugging","Unit Testing"],
  "Backend Developer": ["Node.js","Express.js","REST API","PostgreSQL","SQL","Git","Docker","Debugging","API Design"],
  "Full Stack Developer": ["React","TypeScript","JavaScript","Node.js","Express.js","PostgreSQL","Prisma","REST API","Git","Docker"],
  "Software Engineer": ["Java","Python","SQL","Git","Data Structures","Algorithms","Debugging","Clean Code","Code Review"],
  "Mobile Developer": ["JavaScript","React","TypeScript","Git","REST API","Debugging","Unit Testing"],

  "Product Analyst": ["Data Analysis","Statistics","SQL","Data Visualization","Power BI","Agile","Scrum"],
  "Product Specialist": ["Data Analysis","Data Visualization","Agile","Scrum","Kanban","System Design"],
  "Business Analyst": ["Data Analysis","Statistics","SQL","Data Visualization","Power BI","Agile","Scrum"],
  "Product Associate": ["Data Analysis","Agile","Scrum","Kanban","Data Visualization"],

  "UI Designer": ["Figma","UI Design","Design Systems","Prototyping","UX Design"],
  "UX Designer": ["Figma","UX Design","UI Design","Prototyping","Design Systems"],
  "Product Designer": ["Figma","UI Design","UX Design","Prototyping","Design Systems"],
  "UX Researcher": ["UX Design","UI Design","Prototyping","Figma"],
  "Visual Designer": ["Figma","UI Design","Design Systems","Prototyping"],

  "Data Analyst": ["Python Data Science","Pandas","NumPy","SQL","Data Analysis","Statistics","Data Visualization","Power BI"],
  "Data Scientist": ["Python","Python Data Science","Pandas","NumPy","Statistics","Machine Learning","Scikit-learn","Data Science"],
  "ML Engineer": ["Python","Machine Learning","Deep Learning","PyTorch","TensorFlow","Scikit-learn","Model Deployment","Data Science"],
  "Data Engineer": ["Python","SQL","PostgreSQL","Apache Spark","Apache Kafka","ETL","Git"],

  "Marketing Specialist": ["Data Analysis","Data Visualization","Statistics","Agile"],
  "Content Strategist": ["Data Analysis","Data Visualization","Agile"],
  "Social Media Specialist": ["Data Analysis","Data Visualization"],
  "Growth Specialist": ["Data Analysis","Statistics","Data Visualization","Power BI","Agile"],
  "SEO Specialist": ["Data Analysis","Statistics","Data Visualization"],
  "Content Writer": ["Agile","Data Analysis"],
  "Marketing Analyst": ["Data Analysis","Statistics","SQL","Data Visualization","Power BI"],

  "Cloud Engineer": ["AWS","Azure","Docker","Kubernetes","Terraform","Cloud Architecture","Linux","Git"],
  "DevOps Engineer": ["Docker","Kubernetes","Git","GitHub Actions","CI/CD","Linux","Nginx","AWS"],
  "Site Reliability Engineer": ["Linux","Kubernetes","Docker","AWS","CI/CD","Git","Nginx","Terraform"],
  "Infrastructure Engineer": ["Terraform","AWS","Linux","Docker","Kubernetes","Cloud Architecture","CI/CD"],

  "Financial Analyst": ["Data Analysis","Statistics","SQL","Data Visualization","Power BI"],
  "Finance Associate": ["Data Analysis","Statistics","Data Visualization"],
  "Accounts Analyst": ["Data Analysis","Statistics","SQL","Power BI"],
  "Risk Analyst": ["Data Analysis","Statistics","SQL","Data Science","Machine Learning"],

  "QA Engineer": ["Unit Testing","Integration Testing","End-to-End Testing","Postman","Git","Debugging"],
  "Test Engineer": ["Unit Testing","Integration Testing","End-to-End Testing","Postman","Git"],
  "QA Analyst": ["Integration Testing","End-to-End Testing","Postman","Debugging"],
  "Automation Engineer": ["Unit Testing","Integration Testing","End-to-End Testing","Jest","Cypress","Playwright","Postman","Git"],

  "Operations Analyst": ["Data Analysis","Statistics","SQL","Data Visualization","Power BI","Agile"],
  "Operations Associate": ["Data Analysis","Agile","Kanban"],
  "Process Analyst": ["Data Analysis","Statistics","SQL","Data Visualization","Agile","Kanban"],

  "Security Analyst": ["Cybersecurity","Network Security","OWASP","JWT","Identity Management","Cryptography"],
  "Cybersecurity Analyst": ["Cybersecurity","Network Security","Penetration Testing","OWASP","Cryptography","Identity Management"],
  "Security Engineer": ["Cybersecurity","Network Security","Penetration Testing","OWASP","Cryptography","OAuth 2.0","Identity Management"],
  "SOC Analyst": ["Cybersecurity","Network Security","OWASP","Identity Management","JWT"],
};

const managerSkills: Record<string, string[]> = {
  Engineering: ["System Design","Software Architecture","Agile","Scrum","Code Review","Algorithms","Data Structures"],
  Product: ["Agile","Scrum","Kanban","Data Analysis","Statistics","System Design"],
  Design: ["Figma","UX Design","UI Design","Design Systems","Prototyping","Agile"],
  Data: ["Data Science","Statistics","Machine Learning","Data Analysis","Python Data Science","Apache Spark"],
  Marketing: ["Data Analysis","Statistics","Data Visualization","Agile"],
  DevOps: ["AWS","Docker","Kubernetes","Terraform","Cloud Architecture","CI/CD","Linux"],
  Finance: ["Data Analysis","Statistics","Data Visualization","Power BI"],
  QA: ["Unit Testing","Integration Testing","End-to-End Testing","Postman","Agile"],
  Operations: ["Data Analysis","Statistics","Agile","Kanban","System Design"],
  Security: ["Cybersecurity","Network Security","OWASP","Identity Management","Cryptography"],
};

const managerDepartments: Record<string, string> = {
  "Arjun Mehta":"Engineering",
  "Sophia Williams":"Engineering",
  "Rahul Kapoor":"Product",
  "Emma Thompson":"Design",
  "Vikram Shah":"Data",
  "Olivia Martin":"Marketing",
  "Karan Malhotra":"DevOps",
  "Isabella Anderson":"Finance",
  "Rohan Bhatia":"QA",
  "Charlotte Robinson":"Operations",
  "Aditya Verma":"Security",
};

const employeePositions: Record<string, string> = {
  "Neha Sharma":"Frontend Developer",
  "Aarav Patel":"Backend Developer",
  "Ishita Gupta":"Full Stack Developer",
  "Kabir Singh":"Software Engineer",
  "Ananya Mishra":"Frontend Developer",
  "Yash Agarwal":"Backend Developer",
  "Meera Nair":"Software Engineer",
  "Dev Joshi":"Full Stack Developer",
  "Riya Chopra":"Software Engineer",
  "Aanya Iyer":"Product Analyst",
  "Dhruv Reddy":"Product Specialist",
  "Tanya Khanna":"Product Analyst",
  "Aryan Sethi":"Business Analyst",
  "Kiara Bansal":"Product Associate",
  "Manav Arora":"Business Analyst",
  "Simran Kaur":"Product Specialist",
  "Nikhil Saxena":"Product Analyst",
  "Anika Bose":"UI Designer",
  "Reyansh Roy":"UX Designer",
  "Sara Dutta":"Product Designer",
  "Ayaan Sen":"UX Researcher",
  "Myra Das":"UI Designer",
  "Vihaan Ghosh":"Visual Designer",
  "Saanvi Banerjee":"UX Designer",
  "Advik Mukherjee":"Product Designer",
  "Ira Kulkarni":"Data Analyst",
  "Rehan Khan":"Data Scientist",
  "Nisha Menon":"Data Analyst",
  "Arnav Pillai":"ML Engineer",
  "Kavya Rao":"Data Engineer",
  "Vivaan Desai":"Data Scientist",
  "Shreya Vora":"Data Analyst",
  "Rudra Jain":"ML Engineer",
  "Maya Brown":"Marketing Specialist",
  "Liam Johnson":"Content Strategist",
  "Zoya Ali":"Social Media Specialist",
  "Noah Davis":"Growth Specialist",
  "Avni Sood":"SEO Specialist",
  "Ethan Miller":"Content Writer",
  "Mahi Tiwari":"Marketing Analyst",
  "Siddharth Bajaj":"Cloud Engineer",
  "Mira Thomas":"DevOps Engineer",
  "Aman Yadav":"Site Reliability Engineer",
  "Elena Garcia":"Cloud Engineer",
  "Harsh Bhardwaj":"Infrastructure Engineer",
  "Lucas Wilson":"DevOps Engineer",
  "Pooja Chawla":"Cloud Engineer",
  "Aisha Khan":"Financial Analyst",
  "Ryan Taylor":"Finance Associate",
  "Sakshi Mehra":"Financial Analyst",
  "Henry Moore":"Accounts Analyst",
  "Nandini Gupta":"Finance Associate",
  "James Taylor":"Financial Analyst",
  "Ishaan Walia":"Risk Analyst",
  "Kritika Suri":"QA Engineer",
  "Owen Clark":"Test Engineer",
  "Rhea Malik":"QA Analyst",
  "Jacob Lewis":"Automation Engineer",
  "Anvi Kapoor":"QA Engineer",
  "Mason Walker":"Test Engineer",
  "Tanvi Shah":"QA Analyst",
  "Naina Verma":"Operations Analyst",
  "Logan Hall":"Operations Associate",
  "Rashi Bhat":"Process Analyst",
  "Benjamin Young":"Operations Analyst",
  "Palak Ahuja":"Operations Associate",
  "William King":"Process Analyst",
  "Muskan Jain":"Operations Analyst",
  "Anmol Saini":"Security Analyst",
  "Grace Scott":"Cybersecurity Analyst",
  "Parth Goel":"Security Engineer",
  "Chloe Green":"Security Analyst",
  "Ayush Ahuja":"SOC Analyst",
  "Daniel Adams":"Security Engineer",
  "Ishika Batra":"Cybersecurity Analyst",
  "Sanya Arora":"Mobile Developer",
  "Aarush Mittal":"Software Engineer",
  "Diya Bhalla":"Frontend Developer",
  "Krish Bansal":"Backend Developer",
  "Navya Sethi":"Full Stack Developer",
  "Abeer Khanna":"Software Engineer",
  "Prisha Chawla":"Mobile Developer",
  "Veer Rajput":"Backend Developer",
  "Anushka Singh":"Software Engineer",
  "Samar Khanna":"Data Engineer",
  "Aditi Bhatia":"Data Analyst",
  "Yuvraj Malik":"ML Engineer",
  "Alina Sharma":"UX Designer",
  "Esha Kapoor":"UI Designer",
  "Arya Nanda":"Product Analyst",
  "Kiaan Suri":"Business Analyst",
  "Madhav Rao":"QA Engineer",
  "Aarohi Deshmukh":"Operations Analyst",
};

const normalize = (value: string) => value.trim().toLowerCase();

async function main() {
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
  const skills = await prisma.skill.findMany();

  if (!users.length) throw new Error("No users found. Run seed-employees.ts first.");
  if (!skills.length) throw new Error("No skills found. Run the skill seed first.");

  const skillMap = new Map(skills.map((s) => [normalize(s.name), s.id]));

  let created = 0;
  let skipped = 0;
  let missing = 0;
  let mapped = 0;

  for (const user of users) {
    let names: string[] | undefined;

    const department = managerDepartments[user.name];
    if (department) {
      names = managerSkills[department];
    } else {
      const position = employeePositions[user.name];
      names = position ? positionSkills[position] : undefined;
    }

    if (!names) {
      console.warn(`No skill profile found for ${user.name}`);
      continue;
    }

    mapped++;

    for (const skillName of names) {
      const skillId = skillMap.get(normalize(skillName));

      if (!skillId) {
        console.warn(`Skill "${skillName}" not found for ${user.name}`);
        missing++;
        continue;
      }

      const existing = await prisma.userSkill.findFirst({
        where: { userId: user.id, skillId },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.userSkill.create({
        data: { userId: user.id, skillId },
      });

      created++;
    }
  }

  console.log("\n========================================");
  console.log("USER SKILL SEED COMPLETE");
  console.log("========================================");
  console.log(`Users found: ${users.length}`);
  console.log(`Users mapped: ${mapped}`);
  console.log(`New skill assignments: ${created}`);
  console.log(`Already existed: ${skipped}`);
  console.log(`Missing skills: ${missing}`);
  console.log("========================================");
}

main()
  .catch((error) => {
    console.error("User skill seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });