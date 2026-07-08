import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import type { VisaStatus, VisaType, Prisma } from "@prisma/client";

export interface CreateVisaInput {
  tenantId: string;
  patientId: string;
  type?: VisaType;
  country: string;
  embassy?: string | null;
  applicationDate?: string | null;
  remarks?: string | null;
  attendantCount?: number;
  createdById: string;
}

export interface UpdateVisaInput {
  type?: VisaType;
  status?: VisaStatus;
  country?: string;
  embassy?: string | null;
  applicationDate?: string | null;
  submittedDate?: string | null;
  reviewedDate?: string | null;
  decisionDate?: string | null;
  visaExpiryDate?: string | null;
  portOfEntry?: string | null;
  frroRegistered?: boolean;
  frroNumber?: string | null;
  frroExpiryDate?: string | null;
  remarks?: string | null;
  attendantCount?: number;
  updatedById: string;
}

export interface CreateVisaDocumentInput {
  visaApplicationId: string;
  name: string;
  fileUrl?: string | null;
  notes?: string | null;
}

const visaInclude = {
  patient: { select: { id: true, name: true, referenceNumber: true, country: true } },
  documents: { orderBy: { createdAt: "desc" as const } },
};

export async function listVisaApplications(
  tenantId: string,
  opts: { patientId?: string; status?: string; search?: string; limit?: number; offset?: number } = {}
) {
  const { patientId, status, search, limit = 50, offset = 0 } = opts;
  const where: Prisma.VisaApplicationWhereInput = { tenantId };
  if (patientId) where.patientId = patientId;
  if (status) where.status = status as VisaStatus;
  if (search) {
    where.OR = [
      { patient: { name: { contains: search, mode: "insensitive" } } },
      { country: { contains: search, mode: "insensitive" } },
      { remarks: { contains: search, mode: "insensitive" } },
    ];
  }

  const [applications, total] = await Promise.all([
    prisma.visaApplication.findMany({
      where,
      include: visaInclude,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.visaApplication.count({ where }),
  ]);

  return { applications, total };
}

export async function getVisaApplication(tenantId: string, id: string) {
  return prisma.visaApplication.findFirst({
    where: { id, tenantId },
    include: visaInclude,
  });
}

export async function createVisaApplication(input: CreateVisaInput) {
  const { createdById, ...data } = input;
  const application = await prisma.visaApplication.create({
    data: {
      ...data,
      applicationDate: data.applicationDate ? new Date(data.applicationDate) : undefined,
    },
    include: visaInclude,
  });

  await logAudit({
    tenantId: data.tenantId,
    userId: createdById,
    action: "CREATE",
    entityType: "VisaApplication",
    entityId: application.id,
    after: { patientId: data.patientId, country: data.country },
  });

  return application;
}

export async function updateVisaApplication(
  tenantId: string,
  id: string,
  input: UpdateVisaInput
) {
  const { updatedById, ...data } = input;
  const before = await prisma.visaApplication.findFirst({
    where: { id, tenantId },
  });
  if (!before) throw new Error("Visa application not found");

  const updateData: Prisma.VisaApplicationUpdateInput = {};
  if (data.type !== undefined) updateData.type = data.type;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.country !== undefined) updateData.country = data.country;
  if (data.embassy !== undefined) updateData.embassy = data.embassy;
  if (data.applicationDate !== undefined) updateData.applicationDate = data.applicationDate ? new Date(data.applicationDate) : null;
  if (data.submittedDate !== undefined) updateData.submittedDate = data.submittedDate ? new Date(data.submittedDate) : null;
  if (data.reviewedDate !== undefined) updateData.reviewedDate = data.reviewedDate ? new Date(data.reviewedDate) : null;
  if (data.decisionDate !== undefined) updateData.decisionDate = data.decisionDate ? new Date(data.decisionDate) : null;
  if (data.visaExpiryDate !== undefined) updateData.visaExpiryDate = data.visaExpiryDate ? new Date(data.visaExpiryDate) : null;
  if (data.portOfEntry !== undefined) updateData.portOfEntry = data.portOfEntry;
  if (data.frroRegistered !== undefined) updateData.frroRegistered = data.frroRegistered;
  if (data.frroNumber !== undefined) updateData.frroNumber = data.frroNumber;
  if (data.frroExpiryDate !== undefined) updateData.frroExpiryDate = data.frroExpiryDate ? new Date(data.frroExpiryDate) : null;
  if (data.remarks !== undefined) updateData.remarks = data.remarks;
  if (data.attendantCount !== undefined) updateData.attendantCount = data.attendantCount;

  const application = await prisma.visaApplication.update({
    where: { id },
    data: updateData,
    include: visaInclude,
  });

  await logAudit({
    tenantId,
    userId: updatedById,
    action: "UPDATE",
    entityType: "VisaApplication",
    entityId: id,
    before,
    after: application,
  });

  return application;
}

export async function deleteVisaApplication(tenantId: string, id: string, deletedById: string) {
  const before = await prisma.visaApplication.findFirst({
    where: { id, tenantId },
  });
  if (!before) throw new Error("Visa application not found");

  await prisma.visaApplication.delete({ where: { id } });

  await logAudit({
    tenantId,
    userId: deletedById,
    action: "DELETE",
    entityType: "VisaApplication",
    entityId: id,
    before,
  });
}

export async function addVisaDocument(input: CreateVisaDocumentInput) {
  return prisma.visaDocument.create({ data: input });
}

export async function updateVisaDocument(
  id: string,
  data: { name?: string; fileUrl?: string | null; status?: string; notes?: string | null }
) {
  return prisma.visaDocument.update({ where: { id }, data });
}

export async function deleteVisaDocument(id: string) {
  return prisma.visaDocument.delete({ where: { id } });
}
