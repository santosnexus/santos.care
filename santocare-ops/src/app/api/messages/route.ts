import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/api-helpers";
import { store } from "@/lib/db";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";

export const GET = requirePermission("message:read")(async (req: NextRequest, ctx) => {
  const url = new URL(req.url);
  const patientId = url.searchParams.get("patientId") || undefined;
  const channel = url.searchParams.get("channel") || undefined;
  const threadId = url.searchParams.get("threadId") || undefined;

  let messages = await store.messages.list(ctx.tenantId, patientId);

  if (channel) {
    messages = messages.filter((m: any) => m.channel === channel);
  }
  if (threadId) {
    messages = messages.filter((m: any) => m.threadId === threadId);
  }

  return NextResponse.json({ messages });
});

export const POST = requirePermission("message:create")(async (req: NextRequest, ctx) => {
  const body = await req.json();
  const { channel, direction, patientId, leadId, toAddress, toPhone, subject, bodyText, bodyHtml, template, variables } = body;

  if (!channel || !direction || !bodyText) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const message = await store.messages.create({
    tenantId: ctx.tenantId,
    channel,
    direction,
    patientId: patientId || null,
    leadId: leadId || null,
    toAddress: toAddress || null,
    toPhone: toPhone || null,
    subject: subject || null,
    bodyText: bodyText,
    bodyHtml: bodyHtml || null,
    template: template || null,
    variables: variables || null,
    status: "SENT",
    sentAt: new Date().toISOString(),
    createdById: ctx.user.id,
  });

  // Audit log
  if (prisma) {
    await writeAuditLog(prisma, {
      tenantId: ctx.tenantId,
      userId: ctx.user.id,
      action: "CREATE",
      entityType: "Message",
      entityId: (message as any).id,
      after: { channel, direction, patientId },
    });
  }

  return NextResponse.json({ message }, { status: 201 });
});
