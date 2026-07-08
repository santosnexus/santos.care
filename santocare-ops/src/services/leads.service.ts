/**
 * Lead service — all lead business logic lives here.
 */
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { generateRefNumber } from "@/lib/utils";
import { inngest } from "@/inngest/client";
import type { LeadSource, LeadStatus } from "@prisma/client";

export interface CreateLeadInput {
  tenantId: string;
  source: LeadSource;
  campaign?: string | null;
  name: string;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
  treatmentInterest?: string | null;
  budgetRange?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  createdById: string;
}

/**
 * Auto-score a lead based on data completeness and source quality.
 * Max 50 points (base auto-score). Manual scores can be added on top.
 */
export function calculateLeadScore(input: {
  source: LeadSource;
  email?: string | null;
  phone?: string | null;
  treatmentInterest?: string | null;
  budgetRange?: string | null;
}): number {
  let score = 0;

  // Source quality (max 20 pts)
  const sourceScores: Record<LeadSource, number> = {
    GOOGLE_ADS: 20,
    REFERRAL: 18,
    PARTNER_HOSPITAL: 16,
    FACEBOOK: 12,
    WEBSITE: 10,
    WHATSAPP: 10,
    EXHIBITION: 8,
    OTHER: 5,
  };
  score += sourceScores[input.source] || 5;

  // Contact completeness
  if (input.email) score += 10;
  if (input.phone) score += 10;
  if (input.treatmentInterest) score += 10;
  if (input.budgetRange) score += 5;
  // If budget is specific (not vague like "10000-15000") bonus
  if (input.budgetRange && input.budgetRange.includes("-")) score += 5;

  return Math.min(score, 100);
}

export async function createLead(input: CreateLeadInput) {
  const { createdById, ...rest } = input;

  const score = calculateLeadScore(rest);

  const lead = await prisma.lead.create({
    data: {
      ...rest,
      score,
      email: rest.email || null,
    },
  });

  await logAudit({
    tenantId: input.tenantId,
    userId: createdById,
    action: "CREATE",
    entityType: "Lead",
    entityId: lead.id,
    after: lead,
  });

  inngest.send({
    name: "lead/created",
    data: {
      leadId: lead.id,
      tenantId: input.tenantId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || undefined,
      source: lead.source,
    },
  }).catch(() => {});

  return lead;
}

export async function updateLead(
  tenantId: string,
  id: string,
  data: Partial<Omit<CreateLeadInput, "tenantId" | "createdById">> & {
    status?: LeadStatus;
    score?: number;
    lastContactAt?: string | null;
  },
  updatedById: string
) {
  const before = await prisma.lead.findUnique({ where: { id, tenantId } });
  if (!before) throw new Error("Lead not found");
  if (before.deletedAt) throw new Error("Lead has been deleted");

  const { lastContactAt, ...rest } = data;

  const lead = await prisma.lead.update({
    where: { id, tenantId },
    data: {
      ...rest,
      ...(lastContactAt !== undefined
        ? { lastContactAt: lastContactAt ? new Date(lastContactAt) : null }
        : {}),
    },
  });

  await logAudit({
    tenantId,
    userId: updatedById,
    action: "UPDATE",
    entityType: "Lead",
    entityId: id,
    before,
    after: lead,
  });

  return lead;
}

export async function softDeleteLead(
  tenantId: string,
  id: string,
  deletedById: string
) {
  const lead = await prisma.lead.findUnique({ where: { id, tenantId } });
  if (!lead) throw new Error("Lead not found");
  if (lead.deletedAt) throw new Error("Lead already deleted");

  const deleted = await prisma.lead.update({
    where: { id, tenantId },
    data: { deletedAt: new Date() },
  });

  await logAudit({
    tenantId,
    userId: deletedById,
    action: "DELETE",
    entityType: "Lead",
    entityId: id,
    before: lead,
  });

  return deleted;
}

export async function convertLeadToPatient(
  tenantId: string,
  leadId: string,
  convertedById: string
) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId, tenantId } });
  if (!lead) throw new Error("Lead not found");
  if (lead.status === "CONVERTED") throw new Error("Lead already converted");
  if (lead.deletedAt) throw new Error("Lead has been deleted");

  if (!lead.name) throw new Error("Lead must have a name to convert");

  const referenceNumber = generateRefNumber();
  const email = lead.email || `unknown-${Date.now()}@placeholder.local`;

  const [patient, updatedLead] = await prisma.$transaction([
    prisma.patient.create({
      data: {
        tenantId,
        referenceNumber,
        name: lead.name,
        country: lead.country || "Unknown",
        phone: lead.phone || "",
        email,
        treatmentType: lead.treatmentInterest || "General",
        stage: "INQUIRY_RECEIVED",
        inquiryDate: new Date(),
      },
    }),
    prisma.lead.update({
      where: { id: leadId, tenantId },
      data: {
        status: "CONVERTED",
        conversionDate: new Date(),
        lastContactAt: new Date(),
      },
    }),
  ]);

  // Update with patient ID after creation (two-phase to avoid circular ref)
  await prisma.lead.update({
    where: { id: leadId, tenantId },
    data: { convertedToPatientId: patient.id },
  });

  // Initial stage change record
  await prisma.stageChange.create({
    data: {
      tenantId,
      patientId: patient.id,
      toStage: "INQUIRY_RECEIVED",
      note: `Converted from lead ${leadId}`,
    },
  });

  await logAudit({
    tenantId,
    userId: convertedById,
    action: "UPDATE",
    entityType: "Lead",
    entityId: leadId,
    before: { status: lead.status },
    after: { status: "CONVERTED", convertedToPatientId: patient.id },
  });

  return { patient, lead: updatedLead };
}

export async function getLead(tenantId: string, id: string) {
  return prisma.lead.findFirst({ where: { id, tenantId } });
}

export async function listLeads(
  tenantId: string,
  opts: {
    status?: LeadStatus;
    source?: LeadSource;
    search?: string;
    page?: number;
    pageSize?: number;
    includeDeleted?: boolean;
  } = {}
) {
  const { status, source, search, page = 1, pageSize = 20, includeDeleted = false } = opts;

  const where: any = {
    tenantId,
    ...(!includeDeleted ? { deletedAt: null } : {}),
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: [{ score: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
