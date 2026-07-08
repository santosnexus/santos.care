import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import type { QuoteStatus, LineItemCategory } from "@prisma/client";

export interface QuoteLineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  category?: LineItemCategory;
}

export interface CreateQuoteInput {
  tenantId: string;
  patientId?: string | null;
  lineItems: QuoteLineItemInput[];
  currency?: string;
  taxRate?: number;
  notes?: string | null;
  terms?: string | null;
  validUntil?: string;
  treatmentPlan?: string | null;
  hospitalName?: string | null;
  createdById: string;
}

export async function generateQuoteNumber(tenantId: string): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.quote.count({
    where: { tenantId, number: { startsWith: `QUO-${year}-` } },
  });
  return `QUO-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function createQuote(input: CreateQuoteInput) {
  const { tenantId, createdById, lineItems, currency = "USD", taxRate = 0, notes, terms, validUntil, treatmentPlan, hospitalName, patientId } = input;

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  const number = await generateQuoteNumber(tenantId);

  const quote = await prisma.quote.create({
    data: {
      tenantId,
      patientId: patientId || null,
      number,
      status: "DRAFT",
      currency,
      subtotal,
      taxRate,
      taxAmount,
      total,
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 86_400_000),
      notes,
      terms,
      treatmentPlan: treatmentPlan || null,
      hospitalName: hospitalName || null,
      lineItems: {
        create: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          category: item.category || "SERVICE",
        })),
      },
    },
    include: { lineItems: true, patient: { select: { name: true } } },
  });

  await logAudit({
    tenantId, userId: createdById, action: "CREATE", entityType: "Quote",
    entityId: quote.id, after: { number, total, patientId },
  });

  return quote;
}

export async function getQuote(tenantId: string, id: string) {
  return prisma.quote.findFirst({
    where: { id, tenantId },
    include: {
      lineItems: true,
      patient: { select: { id: true, name: true, email: true, phone: true } },
    },
  });
}

export async function updateQuote(
  tenantId: string,
  id: string,
  data: {
    status?: QuoteStatus;
    notes?: string | null;
    terms?: string | null;
    validUntil?: string | null;
    lineItems?: QuoteLineItemInput[];
    taxRate?: number;
    treatmentPlan?: string | null;
    hospitalName?: string | null;
  },
  updatedById: string
) {
  const before = await prisma.quote.findUnique({ where: { id, tenantId } });
  if (!before) throw new Error("Quote not found");

  const updateData: any = {};
  if (data.status !== undefined) updateData.status = data.status;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.terms !== undefined) updateData.terms = data.terms;
  if (data.validUntil !== undefined) updateData.validUntil = data.validUntil ? new Date(data.validUntil) : null;
  if (data.treatmentPlan !== undefined) updateData.treatmentPlan = data.treatmentPlan;
  if (data.hospitalName !== undefined) updateData.hospitalName = data.hospitalName;

  if (data.status === "SENT") updateData.sentAt = new Date();
  if (data.status === "VIEWED") updateData.viewedAt = new Date();
  if (data.status === "ACCEPTED") updateData.acceptedAt = new Date();
  if (data.status === "REJECTED") updateData.rejectedAt = new Date();

  if (data.lineItems) {
    const subtotal = data.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = subtotal * ((data.taxRate ?? before.taxRate) / 100);
    updateData.subtotal = subtotal;
    updateData.taxAmount = taxAmount;
    updateData.total = subtotal + taxAmount;
  }

  const quote = await prisma.quote.update({
    where: { id, tenantId },
    data: updateData,
    include: { lineItems: true, patient: { select: { name: true } } },
  });

  if (data.lineItems) {
    await prisma.quoteLineItem.deleteMany({ where: { quoteId: id } });
    await prisma.quoteLineItem.createMany({
      data: data.lineItems.map((item) => ({
        quoteId: id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
        category: item.category || "SERVICE",
      })),
    });
  }

  await logAudit({
    tenantId, userId: updatedById, action: "UPDATE", entityType: "Quote", entityId: id, before: { status: before.status }, after: { status: quote.status },
  });

  return prisma.quote.findFirst({
    where: { id, tenantId },
    include: { lineItems: true, patient: { select: { name: true } } },
  });
}

export async function deleteQuote(tenantId: string, id: string, deletedById: string) {
  const before = await prisma.quote.findUnique({ where: { id, tenantId } });
  if (!before) throw new Error("Quote not found");

  await prisma.quoteLineItem.deleteMany({ where: { quoteId: id } });
  await prisma.quote.delete({ where: { id, tenantId } });

  await logAudit({
    tenantId, userId: deletedById, action: "DELETE", entityType: "Quote", entityId: id, before,
  });
}

export async function listQuotes(
  tenantId: string,
  opts: {
    patientId?: string;
    status?: QuoteStatus;
    search?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { patientId, status, search, page = 1, pageSize = 20 } = opts;

  const where: any = { tenantId };
  if (patientId) where.patientId = patientId;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { number: { contains: search, mode: "insensitive" } },
      { patient: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { patient: { select: { name: true } } },
    }),
    prisma.quote.count({ where }),
  ]);

  return { data: items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
