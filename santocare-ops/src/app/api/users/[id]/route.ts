import { NextRequest, NextResponse } from "next/server";
import { requirePermissionDynamic } from "@/lib/api-helpers";
import { store } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";

export const GET = requirePermissionDynamic<{ id: string }>("user:read")(async (req, ctx, { params }) => {
  const user = await store.users.find(params.id, ctx.tenantId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user });
});

export const PATCH = requirePermissionDynamic<{ id: string }>("user:invite")(async (req, ctx, { params }) => {
  const body = await req.json();
  const { name, role, phone, isActive } = body;

  const existing = await store.users.find(params.id, ctx.tenantId);
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (role !== undefined) updateData.role = role;
  if (phone !== undefined) updateData.phone = phone;
  if (isActive !== undefined) {
    updateData.isActive = isActive;
    if (!isActive) {
      updateData.deactivatedAt = new Date().toISOString();
    } else {
      updateData.deactivatedAt = null;
    }
  }

  const user = await store.users.update(params.id, updateData, ctx.tenantId);

  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "UPDATE",
      entityType: "User",
      entityId: params.id,
    });
  }

  return NextResponse.json({ user });
});

export const DELETE = requirePermissionDynamic<{ id: string }>("user:invite")(async (req, ctx, { params }) => {
  const existing = await store.users.find(params.id, ctx.tenantId);
  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user = await store.users.update(params.id, {
    isActive: false,
    deactivatedAt: new Date().toISOString(),
  }, ctx.tenantId);

  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "UPDATE",
      entityType: "User",
      entityId: params.id,
    });
  }

  return NextResponse.json({ message: "User deactivated" });
});
