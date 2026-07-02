import { NextRequest, NextResponse } from "next/server";
import { requirePermissionDynamic } from "@/lib/api-helpers";
import { store } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";

export const GET = requirePermissionDynamic<{ id: string }>("invoice:read")(async (req, ctx, { params }) => {
  const invoice = await store.invoices.find(params.id, ctx.tenantId);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  return NextResponse.json({ invoice });
});

export const PATCH = requirePermissionDynamic<{ id: string }>("invoice:update")(async (req, ctx, { params }) => {
  const body = await req.json();
  const { status, notes, terms, dueDate } = body;

  const existing = await store.invoices.find(params.id, ctx.tenantId);
  if (!existing) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const updateData: any = {};
  if (status !== undefined) {
    updateData.status = status;
    if (status === "SENT") updateData.sentAt = new Date().toISOString();
    if (status === "VIEWED") updateData.viewedAt = new Date().toISOString();
    if (status === "PAID") updateData.paidAt = new Date().toISOString();
  }
  if (notes !== undefined) updateData.notes = notes;
  if (terms !== undefined) updateData.terms = terms;
  if (dueDate !== undefined) updateData.dueDate = dueDate;

  const invoice = await store.invoices.update(params.id, updateData, ctx.tenantId);

  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "UPDATE",
      entityType: "Invoice",
      entityId: params.id,
    });
  }

  return NextResponse.json({ invoice });
});

export const DELETE = requirePermissionDynamic<{ id: string }>("invoice:delete")(async (req, ctx, { params }) => {
  const existing = await store.invoices.find(params.id, ctx.tenantId);
  if (!existing) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  await store.invoices.delete(params.id, ctx.tenantId);

  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "DELETE",
      entityType: "Invoice",
      entityId: params.id,
    });
  }

  return NextResponse.json({ message: "Invoice deleted" });
});
