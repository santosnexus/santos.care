import { NextRequest, NextResponse } from "next/server";
import { requirePermissionDynamic } from "@/lib/api-helpers";
import { store } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";

export const GET = requirePermissionDynamic<{ id: string }>("payment:read")(async (req, ctx, { params }) => {
  const payments = await store.payments.list(ctx.tenantId, params.id);
  return NextResponse.json({ payments });
});

export const POST = requirePermissionDynamic<{ id: string }>("payment:create")(async (req, ctx, { params }) => {
  const body = await req.json();
  const { amount, currency, method, reference, notes } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const invoice = await store.invoices.find(params.id, ctx.tenantId);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const payment = await store.payments.create({
    tenantId: ctx.tenantId,
    invoiceId: params.id,
    amount,
    currency: currency || (invoice as any).currency || "USD",
    method: method || "BANK_TRANSFER",
    reference: reference || null,
    notes: notes || null,
    receivedAt: new Date().toISOString(),
    recordedById: ctx.user.id,
  });

  const newAmountPaid = ((invoice as any).amountPaid || 0) + amount;
  const total = (invoice as any).total;
  let newStatus = "PARTIAL";
  if (newAmountPaid >= total) {
    newStatus = "PAID";
  }

  await store.invoices.update(params.id, {
    amountPaid: newAmountPaid,
    status: newStatus,
    paidAt: newStatus === "PAID" ? new Date().toISOString() : null,
  }, ctx.tenantId);

  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "CREATE",
      entityType: "Payment",
      entityId: (payment as any).id,
    });
  }

  return NextResponse.json({ payment }, { status: 201 });
});
