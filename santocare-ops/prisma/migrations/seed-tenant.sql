import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Seed default tenant
async function seedTenant() {
  console.log("Seeding tenant...");

  // Check if tenant already exists
  const existingTenant = await prisma.tenant.findUnique({
    where: { slug: "santos" },
  });

  if (existingTenant) {
    console.log(`Tenant 'santos' already exists, ID: ${existingTenant.id}`);
    return existingTenant;
  }

  const tenant = await prisma.tenant.create({
    data: {
      id: "santos",
      slug: "santos",
      name: "Santos Care",
      domain: "santos.care",
      plan: "STARTER",
      status: "ACTIVE",
    },
  });

  console.log(`Created tenant 'santos', ID: ${tenant.id}`);
  return tenant;
}

// Seed tenant users (assign to santos tenant)
async function seedTenantUsers() {
  console.log("Seeding tenant users...");

  const users = [
    {
      email: "admin@santos.care",
      name: "Admin User",
      phone: "+1234567890",
      role: "SUPER_ADMIN",
      password: "He@lInd!a2026",
      isActive: true,
    },
    {
      email: "priya@santos.care",
      name: "Priya Sharma",
      phone: "+1234567891",
      role: "COORDINATOR",
      password: "He@lInd!a2026",
      isActive: true,
    },
    {
      email: "rahul@santos.care",
      name: "Rahul Kumar",
      phone: "+1234567892",
      role: "COORDINATOR",
      password: "He@lInd!a2026",
      isActive: true,
    },
    {
      email: "sarah@santos.care",
      name: "Sarah Johnson",
      phone: "+1234567893",
      role: "FINANCE",
      password: "He@lInd!a2026",
      isActive: true,
    },
  ];

  const tenant = await seedTenant();

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`User '${userData.email}' already exists`);
      continue;
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);

    await prisma.user.create({
      data: {
        id: userData.email.split("@")[0],
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role as any,
        passwordHash,
        isActive: userData.isActive,
        tenantId: tenant.id,
      },
    });

    console.log(`Created user '${userData.email}'`);
  }
}

// Assign existing mock data to santos tenant
async function assignExistingDataToTenant() {
  console.log("Assigning existing data to santos tenant...");

  const tenant = await seedTenant();

  // Update all users to have tenantId
  console.log("Updating users tenantId...");
  await prisma.user.updateMany({
    data: { tenantId: tenant.id },
  });

  // Update all patients to have tenantId
  console.log("Updating patients tenantId...");
  await prisma.patient.updateMany({
    data: { tenantId: tenant.id },
  });

  // Update all leads to have tenantId
  console.log("Updating leads tenantId...");
  await prisma.lead.updateMany({
    data: { tenantId: tenant.id },
  });

  // Update all partners to have tenantId
  console.log("Updating partners tenantId...");
  await prisma.partner.updateMany({
    data: { tenantId: tenant.id },
  });

  // Update all documents to have tenantId
  console.log("Updating documents tenantId...");
  await prisma.document.updateMany({
    data: { tenantId: tenant.id },
  });

  // Update all notes to have tenantId
  console.log("Updating notes tenantId...");
  await prisma.note.updateMany({
    data: { tenantId: tenant.id },
  });

  // Update all communications to have tenantId
  console.log("Updating communications tenantId...");
  await prisma.communication.updateMany({
    data: { tenantId: tenant.id },
  });

  // Update all stage changes to have tenantId
  console.log("Updating stage_changes tenantId...");
  await prisma.stageChange.updateMany({
    data: { tenantId: tenant.id },
  });

  // Update all tasks to have tenantId
  console.log("Updating tasks tenantId...");
  await prisma.task.updateMany({
    data: { tenantId: tenant.id },
  });

  // Update all roadmap items to have tenantId
  console.log("Updating roadmap_items tenantId...");
  await prisma.roadmapItem.updateMany({
    data: { tenantId: tenant.id },
  });

  // Update all analytics events to have tenantId
  console.log("Updating analytics_events tenantId...");
  await prisma.analyticsEvent.updateMany({
    data: { tenantId: tenant.id },
  });

  console.log("All existing data assigned to santos tenant");
}

async function main() {
  try {
    await seedTenantUsers();
    await assignExistingDataToTenant();
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
