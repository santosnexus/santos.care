import { NextRequest, NextResponse } from "next/server";
import { requirePermissionDynamic } from "@/lib/api-helpers";

export const GET = requirePermissionDynamic<{ id: string }>("task:read")(async (req, ctx, extra) => {
  return NextResponse.json({ task: { id: extra.params.id } });
});

export const PUT = requirePermissionDynamic<{ id: string }>("task:update")(async (req, ctx, extra) => {
  const body = await req.json();
  return NextResponse.json({ task: { id: extra.params.id, ...body } });
});

export const DELETE = requirePermissionDynamic<{ id: string }>("task:delete")(async (req, ctx, extra) => {
  return NextResponse.json({ success: true, id: extra.params.id });
});
