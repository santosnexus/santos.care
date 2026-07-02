import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/api-helpers";
import { prisma } from "@/lib/db";
import { getAuditLogs } from "@/lib/audit";

export const GET = requirePermission("audit:read")(async (req: NextRequest, ctx) => {
  const url = new URL(req.url);

  const entityType = url.searchParams.get("entityType") || undefined;
  const entityId = url.searchParams.get("entityId") || undefined;
  const userId = url.searchParams.get("userId") || undefined;
  const action = url.searchParams.get("action") || undefined;
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  const startDate = url.searchParams.get("startDate") ? new Date(url.searchParams.get("startDate")!) : undefined;
  const endDate = url.searchParams.get("endDate") ? new Date(url.searchParams.get("endDate")!) : undefined;

  const result = await getAuditLogs(prisma, ctx.tenantId, {
    entityType,
    entityId,
    userId,
    action,
    limit,
    offset,
    startDate,
    endDate,
  });

  return NextResponse.json(result);
});
