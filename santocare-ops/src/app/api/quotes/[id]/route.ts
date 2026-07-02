import { NextRequest, NextResponse } from "next/server";
import { requirePermissionDynamic } from "@/lib/api-helpers";
import { store } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";

export const GET = requirePermissionDynamic<{ id: string }>("quote:read")(async (req, ctx, { params }) => {
  const quote = await store.quotes.find(params.id, ctx.tenantId);
  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }
  return NextResponse.json({ quote });
});

export const PATCH = requirePermissionDynamic<{ id: string }>("quote:update")(async (req, ctx, { params }) => {
  const body = await req.json();
  const { status, notes, terms } = body;

  const existing = await store.quotes.find(params.id, ctx.tenantId);
  if (!existing) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  const updateData: any = {};
  if (status !== undefined) {
    updateData.status = status;
    if (status === "SENT") updateData.sentAt = new Date().toISOString();
    if (status === "VIEWED") updateData.viewedAt = new Date().toISOString();
    if (status === "ACCEPTED") updateData.acceptedAt = new Date().toISOString();
    if (status === "REJECTED") updateData.rejectedAt = new Date().toISOString();
  }
  if (notes !== undefined) updateData.notes = notes;
  if (terms !== undefined) updateData.terms = terms;

  const quote = await store.quotes.update(params.id, updateData, ctx.tenantId);

  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "UPDATE",
      entityType: "Quote",
      entityId: params.id,
    });
  }

  return NextResponse.json({ quote });
});

export const DELETE = requirePermissionDynamic<{ id: string }>("quote:delete")(async (req, ctx, { params }) => {
  const existing = await store.quotes.find(params.id, ctx.tenantId);
  if (!existing) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  await store.quotes.delete(params.id, ctx.tenantId);

  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "DELETE",
      entityType: "Quote",
      entityId: params.id,
    });
  }

  return NextResponse.json({ message: "Quote deleted" });
});
