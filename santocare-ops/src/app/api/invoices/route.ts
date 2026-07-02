import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/api-helpers";
import { store } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";

export const GET = requirePermission("invoice:read")(async (req: NextRequest, ctx) => {
  const url = new URL(req.url);
  const patientId = url.searchParams.get("patientId") || undefined;
  const status = url.searchParams.get("status") || undefined;

  let invoices = await store.invoices.list(ctx.tenantId);

  if (patientId) {
    invoices = invoices.filter((i: any) => i.patientId === patientId);
  }
  if (status) {
    invoices = invoices.filter((i: any) => i.status === status);
  }

  return NextResponse.json({ invoices });
});

export const POST = requirePermission("invoice:create")(async (req: NextRequest, ctx) => {
  const body = await req.json();
  const { patientId, lineItems, currency, taxRate, notes, terms, dueDate } = body;

  if (!patientId || !lineItems || lineItems.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * ((taxRate || 0) / 100);
  const total = subtotal + taxAmount;

  // Generate invoice number
  const number = await store.invoices.generateNumber(ctx.tenantId);

  const invoice = await store.invoices.create({
    tenantId: ctx.tenantId,
    patientId,
    number,
    status: "DRAFT",
    currency: currency || "USD",
    subtotal,
    taxRate: taxRate || 0,
    taxAmount,
    total,
    amountPaid: 0,
    issueDate: new Date().toISOString(),
    dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: notes || null,
    terms: terms || null,
    lineItems: lineItems.map((item: any) => ({
      description: item.description,
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice,
      total: (item.quantity || 1) * item.unitPrice,
      category: item.category || "SERVICE",
      refId: item.refId || null,
    })),
  });

  // Audit log
  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "CREATE",
      entityType: "Invoice",
      entityId: (invoice as any).id,
      after: { number, total, patientId },
    });
  }

  return NextResponse.json({ invoice }, { status: 201 });
});
