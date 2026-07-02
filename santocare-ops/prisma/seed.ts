/**
 * Database seed script.
 *
 * Run with: npm run db:seed
 * (requires DATABASE_URL to be set in .env)
 *
 * This script populates the database with initial users, sample patients,
 * leads, partners, and tasks. Idempotent — safe to re-run.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { mockPatients, mockLeads, mockPartners, mockTasks } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Default password for all demo users
  const defaultPassword = "He@lInd!a2026";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // Seed users with real password hashes
  const users = [
    {
      id: "1",
      email: "admin@santos.care",
      name: "Admin",
      phone: null,
      role: "ADMIN",
      avatar: null,
      passwordHash,
    },
    {
      id: "2",
      email: "priya@santos.care",
      name: "Priya Sharma",
      phone: "+91 999 111 2222",
      role: "COORDINATOR",
      avatar: null,
      passwordHash,
    },
    {
      id: "3",
      email: "rahul@santos.care",
      name: "Rahul Kumar",
      phone: "+91 999 333 4444",
      role: "COORDINATOR",
      avatar: null,
      passwordHash,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: { passwordHash },
      create: u as any,
    });
  }
  console.log(`  ${users.length} users (password: ${defaultPassword})`);

  // Seed partners
  for (const p of mockPartners) {
    await prisma.partner.upsert({
      where: { id: p.id },
      update: p as any,
      create: p as any,
    });
  }
  console.log(`  ${mockPartners.length} partners`);

  // Seed patients
  for (const p of mockPatients) {
    await prisma.patient.upsert({
      where: { id: p.id },
      update: p as any,
      create: p as any,
    });
  }
  console.log(`  ${mockPatients.length} patients`);

  // Seed leads
  for (const l of mockLeads) {
    await prisma.lead.upsert({
      where: { id: l.id },
      update: l as any,
      create: l as any,
    });
  }
  console.log(`  ${mockLeads.length} leads`);

  // Seed tasks
  for (const t of mockTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: t as any,
      create: t as any,
    });
  }
  console.log(`  ${mockTasks.length} tasks`);

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
