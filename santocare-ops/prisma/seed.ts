/**
 * Database seed script.
 *
 * Run with: npx prisma db seed
 * (requires DATABASE_URL to be set in .env)
 *
 * This script populates the database with initial users, sample patients,
 * leads, partners, and tasks. Idempotent — safe to re-run.
 */

import { PrismaClient } from "@prisma/client";
import { mockPatients, mockLeads, mockPartners, mockTasks, mockUsers } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed users
  for (const u of mockUsers) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: u as any,
      create: u as any,
    });
  }
  console.log(`  ${mockUsers.length} users seeded`);

  // Seed partners
  for (const p of mockPartners) {
    await prisma.partner.upsert({
      where: { id: p.id },
      update: p as any,
      create: p as any,
    });
  }
  console.log(`  ${mockPartners.length} partners seeded`);

  // Seed patients
  for (const p of mockPatients) {
    await prisma.patient.upsert({
      where: { id: p.id },
      update: p as any,
      create: p as any,
    });
  }
  console.log(`  ${mockPatients.length} patients seeded`);

  // Seed leads
  for (const l of mockLeads) {
    await prisma.lead.upsert({
      where: { id: l.id },
      update: l as any,
      create: l as any,
    });
  }
  console.log(`  ${mockLeads.length} leads seeded`);

  // Seed tasks
  for (const t of mockTasks) {
    await prisma.task.upsert({
      where: { id: t.id },
      update: t as any,
      create: t as any,
    });
  }
  console.log(`  ${mockTasks.length} tasks seeded`);

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
