import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import type { PaymentMethod, InvoiceStatus } from "@prisma/client";

export interface CreatePaymentInput {
  tenantId: string;
  invoiceId: string;
  amount: number;
  currency?: string;
  method?: PaymentMethod;
  reference?: string | null;
  notes?: string | null;
  recordedById: string;
}

export async function createPayment(input: CreatePaymentInput) {
  const { tenantId, recordedById, amount, currency = "USD", method = "BANK_TRANSFER", reference, notes, invoiceId } = input;

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId, tenantId } });
  if (!invoice) throw new Error("Invoice not found");

  const payment = await prisma.payment.create({
    data: {
      tenantId,
      invoiceId,
      amount,
      currency,
      method,
      reference: reference || null,
      notes: notes || null,
      receivedAt: new Date(),
      recordedById,
    },
  });

  const newAmountPaid = invoice.amountPaid + amount;
  let newStatus: InvoiceStatus = "PARTIAL";
  if (newAmountPaid >= invoice.total) {
    newStatus = "PAID";
  }

  await prisma.invoice.update({
    where: { id: invoiceId, tenantId },
    data: {
      amountPaid: newAmountPaid,
      status: newStatus,
      paidAt: newStatus === "PAID" ? new Date() : undefined,
    },
  });

  await logAudit({
    tenantId, userId: recordedById, action: "CREATE", entityType: "Payment",
    entityId: payment.id, after: { invoiceId, amount, status: newStatus },
  });

  return payment;
}

export async function listPayments(tenantId: string, invoiceId: string) {
  return prisma.payment.findMany({
    where: { tenantId, invoiceId },
    orderBy: { receivedAt: "desc" },
  });
}
