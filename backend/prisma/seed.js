import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting Prisma database seeding...");

  // 1. Clear existing data (optional / safe reset)
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("🧹 Cleared existing task and user records.");

  // 2. Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  // 3. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    },
  });

  const johnUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: userPassword,
      role: "user",
    },
  });

  const janeUser = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      password: userPassword,
      role: "user",
    },
  });

  console.log("👤 Created 3 seed users:");
  console.log(`   - Admin: ${adminUser.email} (password: admin123)`);
  console.log(`   - User: ${johnUser.email} (password: user123)`);
  console.log(`   - User: ${janeUser.email} (password: user123)`);

  // 4. Create Sample Tasks
  const tasksData = [
    {
      title: "Set up Prisma Database Schema",
      description: "Define User and Task models with relational mappings and enums.",
      status: "Completed",
      userId: adminUser.id,
    },
    {
      title: "Implement Role-Based Access Control (RBAC)",
      description: "Ensure users can only manage their own tasks while admins can manage all tasks.",
      status: "In_Progress",
      userId: adminUser.id,
    },
    {
      title: "Design Responsive Dark Dashboard UI",
      description: "Build clean, glassmorphic Shadcn-style components using Tailwind CSS.",
      status: "Completed",
      userId: johnUser.id,
    },
    {
      title: "Implement Server-Side Pagination",
      description: "Handle page and limit query parameters in Prisma transaction queries.",
      status: "In_Progress",
      userId: johnUser.id,
    },
    {
      title: "Configure Title Search and Status Filtering",
      description: "Add case-insensitive title search and status dropdown filters.",
      status: "Pending",
      userId: janeUser.id,
    },
    {
      title: "Write API Documentation and README",
      description: "Document project setup, Supabase database configuration, and endpoints.",
      status: "Completed",
      userId: janeUser.id,
    },
  ];

  for (const task of tasksData) {
    await prisma.task.create({ data: task });
  }

  console.log(`✅ Seeded ${tasksData.length} sample tasks successfully.`);
}

main()
  .catch((e) => {
    console.error("❌ Error during Prisma database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
