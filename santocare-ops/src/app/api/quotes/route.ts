import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/api-helpers";
import { store } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";

export const GET = requirePermission("quote:read")(async (req: NextRequest, ctx) => {
  const url = new URL(req.url);
  const patientId = url.searchParams.get("patientId") || undefined;
  const status = url.searchParams.get("status") || undefined;

  let quotes = await store.quotes.list(ctx.tenantId);

  if (patientId) {
    quotes = quotes.filter((q: any) => q.patientId === patientId);
  }
  if (status) {
    quotes = quotes.filter((q: any) => q.status === status);
  }

  return NextResponse.json({ quotes });
});

export const POST = requirePermission("quote:create")(async (req: NextRequest, ctx) => {
  const body = await req.json();
  const { patientId, lineItems, currency, taxRate, notes, terms, validUntil, treatmentPlan, hospitalName } = body;

  if (!lineItems || lineItems.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = subtotal * ((taxRate || 0) / 100);
  const total = subtotal + taxAmount;

  // Generate quote number
  const number = await store.quotes.generateNumber(ctx.tenantId);

  const quote = await store.quotes.create({
    tenantId: ctx.tenantId,
    patientId: patientId || null,
    number,
    status: "DRAFT",
    currency: currency || "USD",
    subtotal,
    taxRate: taxRate || 0,
    taxAmount,
    total,
    validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: notes || null,
    terms: terms || null,
    treatmentPlan: treatmentPlan || null,
    hospitalName: hospitalName || null,
    lineItems: lineItems.map((item: any) => ({
      description: item.description,
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice,
      total: (item.quantity || 1) * item.unitPrice,
      category: item.category || "SERVICE",
    })),
  });

  // Audit log
  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "CREATE",
      entityType: "Quote",
      entityId: (quote as any).id,
      after: { number, total, patientId },
    });
  }

  return NextResponse.json({ quote }, { status: 201 });
});
