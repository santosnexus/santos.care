/**
 * Patient service — all patient business logic lives here.
 * Routes call these functions; they never contain business logic themselves.
 */
import { prisma } from "@/lib/db";
import { generateRefNumber } from "@/lib/utils";
import { logAudit } from "@/lib/audit";
import { inngest } from "@/inngest/client";
import type { PipelineStage } from "@prisma/client";

export interface CreatePatientInput {
  tenantId: string;
  referenceNumber?: string;
  name: string;
  country: string;
  phone: string;
  email?: string;
  whatsapp?: string | null;
  treatmentType?: string;
  treatmentDescription?: string | null;
  preferredHospital?: string | null;
  stage?: string;
  estimatedCost?: number | null;
  assignedCoordinatorId?: string | null;
  expectedTravelDate?: string | null;
  depositReceived?: boolean;
  depositAmount?: number | null;
  finalCost?: number | null;
  createdById: string;
}

export interface UpdatePatientInput {
  tenantId: string;
  id: string;
  data: Partial<Omit<CreatePatientInput, "tenantId" | "createdById">>;
  updatedById: string;
}

export async function createPatient(input: CreatePatientInput) {
  const {
    tenantId,
    createdById,
    stage,
    expectedTravelDate,
    email,
    ...rest
  } = input;

  const referenceNumber = rest.referenceNumber || generateRefNumber();

  const patient = await prisma.patient.create({
    data: {
      ...rest,
      tenantId,
      referenceNumber,
      email: email || `noreply-${Date.now()}@santos.care`,
      stage: (stage as PipelineStage) || "INQUIRY_RECEIVED",
      expectedTravelDate: expectedTravelDate ? new Date(expectedTravelDate) : null,
    } as any,
  });

  // Log initial stage
  await prisma.stageChange.create({
    data: {
      tenantId,
      patientId: patient.id,
      toStage: patient.stage,
      note: "Patient created",
    },
  });

  await logAudit({
    tenantId,
    userId: createdById,
    action: "CREATE",
    entityType: "Patient",
    entityId: patient.id,
    after: patient,
  });

  inngest.send({
    name: "patient/created",
    data: {
      patientId: patient.id,
      tenantId,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      whatsapp: input.whatsapp,
      referenceNumber: patient.referenceNumber,
      coordinatorId: input.assignedCoordinatorId,
    },
  }).catch(() => {});

  return patient;
}

export async function updatePatient(input: UpdatePatientInput) {
  const { tenantId, id, data, updatedById } = input;

  const before = await prisma.patient.findUnique({ where: { id, tenantId } });
  if (!before) throw new Error("Patient not found");
  if (before.deletedAt) throw new Error("Patient has been deleted");

  const { expectedTravelDate, actualTravelDate, ...rest } = data as any;

  const patient = await prisma.patient.update({
    where: { id, tenantId },
    data: {
      ...rest,
      ...(expectedTravelDate !== undefined
        ? { expectedTravelDate: expectedTravelDate ? new Date(expectedTravelDate) : null }
        : {}),
      ...(actualTravelDate !== undefined
        ? { actualTravelDate: actualTravelDate ? new Date(actualTravelDate) : null }
        : {}),
    },
  });

  await logAudit({
    tenantId,
    userId: updatedById,
    action: "UPDATE",
    entityType: "Patient",
    entityId: id,
    before,
    after: patient,
  });

  return patient;
}

export async function softDeletePatient(
  tenantId: string,
  id: string,
  deletedById: string
) {
  const patient = await prisma.patient.findUnique({ where: { id, tenantId } });
  if (!patient) throw new Error("Patient not found");
  if (patient.deletedAt) throw new Error("Patient already deleted");

  const deleted = await prisma.patient.update({
    where: { id, tenantId },
    data: { deletedAt: new Date() },
  });

  await logAudit({
    tenantId,
    userId: deletedById,
    action: "DELETE",
    entityType: "Patient",
    entityId: id,
    before: patient,
  });

  return deleted;
}

export async function changePatientStage(
  tenantId: string,
  patientId: string,
  toStage: PipelineStage,
  note: string | null | undefined,
  changedById: string
) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId, tenantId } });
  if (!patient) throw new Error("Patient not found");
  if (patient.deletedAt) throw new Error("Patient has been deleted");

  const [updatedPatient] = await prisma.$transaction([
    prisma.patient.update({
      where: { id: patientId, tenantId },
      data: { stage: toStage },
    }),
    prisma.stageChange.create({
      data: {
        tenantId,
        patientId,
        fromStage: patient.stage,
        toStage,
        note: note || null,
      },
    }),
  ]);

  await logAudit({
    tenantId,
    userId: changedById,
    action: "UPDATE",
    entityType: "Patient",
    entityId: patientId,
    before: { stage: patient.stage },
    after: { stage: toStage },
  });

  inngest.send({
    name: "patient/stage-changed",
    data: {
      patientId,
      tenantId,
      fromStage: patient.stage,
      toStage,
      patientName: patient.name,
      patientEmail: patient.email,
      patientPhone: patient.phone,
    },
  }).catch(() => {});

  return updatedPatient;
}

export async function getPatient(tenantId: string, id: string) {
  return prisma.patient.findFirst({
    where: { id, tenantId },
    include: {
      assignedCoordinator: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getPatientWithHistory(tenantId: string, id: string) {
  return prisma.patient.findUnique({
    where: { id, tenantId },
    include: {
      stageHistory: { orderBy: { changedAt: "asc" } },
      assignedCoordinator: { select: { id: true, name: true, email: true } },
      notes: { orderBy: { createdAt: "desc" }, take: 20, include: { createdBy: { select: { name: true } } } },
      tasks: { where: { status: { not: "CANCELLED" } }, orderBy: { dueDate: "asc" } },
      invoices: { orderBy: { createdAt: "desc" }, take: 5 },
      quotes: { orderBy: { createdAt: "desc" }, take: 5 },
      documents: { orderBy: { createdAt: "desc" }, take: 10 },
      itinerary: { include: { events: { orderBy: { order: "asc" } } } },
    },
  });
}

export async function listPatients(
  tenantId: string,
  opts: {
    stage?: string;
    country?: string;
    coordinatorId?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    includeDeleted?: boolean;
  } = {}
) {
  const { stage, country, coordinatorId, search, page = 1, pageSize = 20, includeDeleted = false } = opts;

  const where: any = {
    tenantId,
    ...(!includeDeleted ? { deletedAt: null } : {}),
    ...(stage ? { stage } : {}),
    ...(country ? { country } : {}),
    ...(coordinatorId ? { assignedCoordinatorId: coordinatorId } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { referenceNumber: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      orderBy: { inquiryDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        assignedCoordinator: { select: { id: true, name: true } },
      },
    }),
    prisma.patient.count({ where }),
  ]);

  return { patients, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
