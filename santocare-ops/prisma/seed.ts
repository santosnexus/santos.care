/**
 * Database seed script.
 *
 * Run with: npm run db:seed
 * (requires DATABASE_URL to be set in .env)
 *
 * This script populates the database with initial users, sample patients,
 * leads, partners, tasks, invoices, quotes, and messages. Idempotent — safe to re-run.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { mockPatients, mockLeads, mockPartners, mockTasks } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data (reverse dependency order)
  await prisma.messageTemplate.deleteMany();
  await prisma.message.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.quoteLineItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceLineItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.communication.deleteMany();
  await prisma.note.deleteMany();
  await prisma.document.deleteMany();
  await prisma.stageChange.deleteMany();
  await prisma.task.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.roadmapItem.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  console.log("  cleaned existing data");

  // Default tenant
  const tenantId = "santos";
  await prisma.tenant.create({
    data: { id: tenantId, slug: tenantId, name: "Santos Care", plan: "STARTER", status: "ACTIVE" },
  });
  console.log(`  tenant: ${tenantId}`);

  // Default password for all demo users
  const defaultPassword = "demo";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // Seed users with real password hashes
  const users = [
    {
      id: "1",
      tenantId,
      email: "admin@santos.care",
      name: "Admin",
      phone: null,
      role: "ADMIN",
      avatar: null,
      passwordHash,
    },
    {
      id: "2",
      tenantId,
      email: "priya@santos.care",
      name: "Priya Sharma",
      phone: "+91 999 111 2222",
      role: "COORDINATOR",
      avatar: null,
      passwordHash,
    },
    {
      id: "3",
      tenantId,
      email: "rahul@santos.care",
      name: "Rahul Kumar",
      phone: "+91 999 333 4444",
      role: "COORDINATOR",
      avatar: null,
      passwordHash,
    },
  ];

  for (const u of users) {
    await prisma.user.create({ data: { ...u, isActive: true, createdAt: new Date() } as any });
  }
  console.log(`  ${users.length} users (password: ${defaultPassword})`);

  // Seed partners
  for (const p of mockPartners) {
    await prisma.partner.create({ data: p as any });
  }
  console.log(`  ${mockPartners.length} partners`);

  // Seed patients
  for (const p of mockPatients) {
    await prisma.patient.create({ data: p as any });
  }
  console.log(`  ${mockPatients.length} patients`);

  // Seed leads
  for (const l of mockLeads) {
    await prisma.lead.create({ data: l as any });
  }
  console.log(`  ${mockLeads.length} leads`);

  // Seed tasks
  for (const t of mockTasks) {
    await prisma.task.create({ data: { ...t, tenantId, createdById: t.createdById || "1" } as any });
  }
  console.log(`  ${mockTasks.length} tasks`);

  // Seed demo invoices
  const demoInvoices = [
    {
      id: "inv-1",
      tenantId: "santos",
      patientId: mockPatients[0]?.id || "1",
      number: "INV-2026-0001",
      status: "SENT",
      currency: "USD",
      subtotal: 12500,
      taxRate: 0,
      taxAmount: 0,
      total: 12500,
      amountPaid: 5000,
      issueDate: new Date("2026-06-15"),
      dueDate: new Date("2026-07-15"),
      sentAt: new Date("2026-06-16"),
      notes: "Cardiac surgery package - Apollo Hospital",
      terms: "Payment due within 30 days of invoice date",
    },
    {
      id: "inv-2",
      tenantId: "santos",
      patientId: mockPatients[1]?.id || "2",
      number: "INV-2026-0002",
      status: "PAID",
      currency: "USD",
      subtotal: 8500,
      taxRate: 0,
      taxAmount: 0,
      total: 8500,
      amountPaid: 8500,
      issueDate: new Date("2026-05-20"),
      dueDate: new Date("2026-06-20"),
      sentAt: new Date("2026-05-21"),
      paidAt: new Date("2026-06-10"),
      notes: "Knee replacement surgery - Fortis Hospital",
    },
  ];

  for (const inv of demoInvoices) {
    await prisma.invoice.create({
      data: {
        ...inv as any,
        lineItems: {
          create: [
            {
              description: "Surgery package",
              quantity: 1,
              unitPrice: inv.subtotal * 0.6,
              total: inv.subtotal * 0.6,
              category: "SURGERY",
            },
            {
              description: "Hospital stay (5 days)",
              quantity: 5,
              unitPrice: inv.subtotal * 0.08,
              total: inv.subtotal * 0.08,
              category: "HOSPITAL",
            },
          ],
        },
      },
    });
  }
  console.log(`  ${demoInvoices.length} invoices`);

  // Seed demo quotes
  const demoQuotes = [
    {
      id: "quo-1",
      tenantId: "santos",
      patientId: mockPatients[2]?.id || "3",
      number: "QUO-2026-0001",
      status: "SENT",
      currency: "USD",
      subtotal: 15000,
      taxRate: 0,
      taxAmount: 0,
      total: 15000,
      validUntil: new Date("2026-08-01"),
      sentAt: new Date("2026-06-25"),
      treatmentPlan: "Cardiac bypass surgery + 7 day recovery",
      hospitalName: "Apollo Hospitals, Chennai",
      notes: "Quote valid for 30 days",
    },
    {
      id: "quo-2",
      tenantId: "santos",
      number: "QUO-2026-0002",
      status: "DRAFT",
      currency: "USD",
      subtotal: 6500,
      taxRate: 0,
      taxAmount: 0,
      total: 6500,
      validUntil: new Date("2026-08-15"),
      treatmentPlan: "Ayurveda wellness package - 14 days",
      hospitalName: "Kairali Ayurveda, Kerala",
    },
  ];

  for (const quo of demoQuotes) {
    await prisma.quote.create({
      data: {
        ...quo as any,
        lineItems: {
          create: [
            {
              description: "Treatment package",
              quantity: 1,
              unitPrice: quo.subtotal * 0.7,
              total: quo.subtotal * 0.7,
              category: "SURGERY",
            },
            {
              description: "Accommodation",
              quantity: 7,
              unitPrice: quo.subtotal * 0.04,
              total: quo.subtotal * 0.04,
              category: "HOTEL",
            },
          ],
        },
      },
    });
  }
  console.log(`  ${demoQuotes.length} quotes`);

  // Seed demo messages
  const demoMessages = [
    {
      id: "msg-1",
      tenantId: "santos",
      channel: "WHATSAPP",
      direction: "INBOUND",
      patientId: mockPatients[0]?.id || "1",
      bodyText: "Hello, I'm interested in cardiac surgery in India. Can you provide more details?",
      status: "READ",
      fromPhone: "+254 712 345678",
      sentAt: new Date("2026-06-20T10:30:00"),
    },
    {
      id: "msg-2",
      tenantId: "santos",
      channel: "WHATSAPP",
      direction: "OUTBOUND",
      patientId: mockPatients[0]?.id || "1",
      bodyText: "Thank you for your interest! We specialize in cardiac surgery at Apollo Hospitals. The package includes surgery, hospital stay, and post-op care. Would you like me to send a detailed quote?",
      status: "DELIVERED",
      toPhone: "+254 712 345678",
      sentAt: new Date("2026-06-20T10:35:00"),
    },
    {
      id: "msg-3",
      tenantId: "santos",
      channel: "EMAIL",
      direction: "OUTBOUND",
      patientId: mockPatients[1]?.id || "2",
      subject: "Treatment Plan - Knee Replacement",
      bodyText: "Dear Patient,\n\nPlease find attached the treatment plan for your knee replacement surgery at Fortis Hospital.\n\nBest regards,\nSantoCare Team",
      status: "SENT",
      toAddress: "patient@email.com",
      sentAt: new Date("2026-06-22T14:00:00"),
    },
  ];

  for (const msg of demoMessages) {
    await prisma.message.create({ data: msg as any });
  }
  console.log(`  ${demoMessages.length} messages`);

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
