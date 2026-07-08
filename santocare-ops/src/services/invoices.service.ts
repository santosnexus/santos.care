import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import type { InvoiceStatus, LineItemCategory } from "@prisma/client";

export interface InvoiceLineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  category?: LineItemCategory;
  refId?: string | null;
}

export interface CreateInvoiceInput {
  tenantId: string;
  patientId: string;
  lineItems: InvoiceLineItemInput[];
  currency?: string;
  taxRate?: number;
  notes?: string | null;
  terms?: string | null;
  dueDate?: string;
  createdById: string;
}

export async function generateInvoiceNumber(tenantId: string): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count({
    where: { tenantId, number: { startsWith: `INV-${year}-` } },
  });
  return `INV-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function createInvoice(input: CreateInvoiceInput) {
  const { tenantId, createdById, lineItems, currency = "USD", taxRate = 0, notes, terms, dueDate, patientId } = input;

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  const number = await generateInvoiceNumber(tenantId);

  const invoice = await prisma.invoice.create({
    data: {
      tenantId,
      patientId,
      number,
      status: "DRAFT",
      currency,
      subtotal,
      taxRate,
      taxAmount,
      total,
      amountPaid: 0,
      issueDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 86_400_000),
      notes,
      terms,
      lineItems: {
        create: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          category: item.category || "SERVICE",
          refId: item.refId || null,
        })),
      },
    },
    include: { lineItems: true, patient: { select: { name: true } } },
  });

  await logAudit({
    tenantId, userId: createdById, action: "CREATE", entityType: "Invoice",
    entityId: invoice.id, after: { number, total, patientId },
  });

  return invoice;
}

export async function getInvoice(tenantId: string, id: string) {
  return prisma.invoice.findFirst({
    where: { id, tenantId },
    include: {
      lineItems: true,
      patient: { select: { id: true, name: true, email: true, phone: true } },
      payments: { orderBy: { receivedAt: "desc" } },
    },
  });
}

export async function updateInvoice(
  tenantId: string,
  id: string,
  data: {
    status?: InvoiceStatus;
    notes?: string | null;
    terms?: string | null;
    dueDate?: string | null;
    lineItems?: InvoiceLineItemInput[];
    taxRate?: number;
  },
  updatedById: string
) {
  const before = await prisma.invoice.findUnique({ where: { id, tenantId } });
  if (!before) throw new Error("Invoice not found");

  const updateData: any = {};
  if (data.status !== undefined) updateData.status = data.status;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.terms !== undefined) updateData.terms = data.terms;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

  if (data.status === "SENT") updateData.sentAt = new Date();
  if (data.status === "VIEWED") updateData.viewedAt = new Date();
  if (data.status === "PAID") updateData.paidAt = new Date();

  if (data.lineItems) {
    const subtotal = data.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = subtotal * ((data.taxRate ?? before.taxRate) / 100);
    updateData.subtotal = subtotal;
    updateData.taxAmount = taxAmount;
    updateData.total = subtotal + taxAmount;
  }

  const invoice = await prisma.invoice.update({
    where: { id, tenantId },
    data: updateData,
    include: { lineItems: true, patient: { select: { name: true } } },
  });

  if (data.lineItems) {
    await prisma.invoiceLineItem.deleteMany({ where: { invoiceId: id } });
    await prisma.invoiceLineItem.createMany({
      data: data.lineItems.map((item) => ({
        invoiceId: id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
        category: item.category || "SERVICE",
        refId: item.refId || null,
      })),
    });
  }

  await logAudit({
    tenantId, userId: updatedById, action: "UPDATE", entityType: "Invoice", entityId: id, before: { status: before.status }, after: { status: invoice.status },
  });

  return prisma.invoice.findFirst({
    where: { id, tenantId },
    include: { lineItems: true, patient: { select: { name: true } } },
  });
}

export async function deleteInvoice(tenantId: string, id: string, deletedById: string) {
  const before = await prisma.invoice.findUnique({ where: { id, tenantId } });
  if (!before) throw new Error("Invoice not found");

  await prisma.invoiceLineItem.deleteMany({ where: { invoiceId: id } });
  await prisma.invoice.delete({ where: { id, tenantId } });

  await logAudit({
    tenantId, userId: deletedById, action: "DELETE", entityType: "Invoice", entityId: id, before,
  });
}

export async function listInvoices(
  tenantId: string,
  opts: {
    patientId?: string;
    status?: InvoiceStatus;
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
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { patient: { select: { name: true } } },
    }),
    prisma.invoice.count({ where }),
  ]);

  return { data: items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
