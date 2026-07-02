import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/api-helpers";
import { store } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";

export const GET = requirePermission("user:read")(async (req: NextRequest, ctx) => {
  const users = await store.users.list(ctx.tenantId);
  return NextResponse.json({ users });
});

export const POST = requirePermission("user:invite")(async (req: NextRequest, ctx) => {
  const body = await req.json();
  const { email, name, role, phone } = body;

  if (!email || !name || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check if user already exists
  const existing = await store.users.findByEmail(email, ctx.tenantId);
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  // Generate temporary password
  const tempPassword = Math.random().toString(36).slice(-12);
  const passwordHash = await hashPassword(tempPassword);

  const user = await store.users.create({
    tenantId: ctx.tenantId,
    email,
    name,
    role,
    phone: phone || null,
    passwordHash,
    invitedById: ctx.user.id,
    invitedAt: new Date().toISOString(),
    isActive: true,
  });

  // Audit log
  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "CREATE",
      entityType: "User",
      entityId: (user as any).id,
      after: { email, name, role },
    });
  }

  return NextResponse.json({
    user,
    tempPassword, // In production, send via email instead
    message: "User invited successfully",
  }, { status: 201 });
});
