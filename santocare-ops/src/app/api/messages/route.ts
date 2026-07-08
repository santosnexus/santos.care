import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { createCommunication, listCommunications } from "@/services/communications.service";
import type { CommType, CommDirection } from "@prisma/client";

const ListQuerySchema = z.object({
  patientId: z.string().optional(),
  type: z.string().optional(),
  direction: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const CreateCommSchema = z.object({
  patientId: z.string().min(1),
  type: z.enum(["WHATSAPP", "EMAIL", "CALL", "MESSAGE"]),
  direction: z.enum(["INBOUND", "OUTBOUND"]),
  content: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "message:read");
  if (!auth.ok) return auth.response;

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { patientId, type, direction, page, limit } = parsed.data;

  const result = await listCommunications(auth.user.tenantId, {
    patientId,
    type: type as CommType | undefined,
    direction: direction as CommDirection | undefined,
    page,
    pageSize: limit,
  });

  return NextResponse.json({
    data: result.data,
    meta: { total: result.total, page, limit, totalPages: result.totalPages },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "message:create");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateCommSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const comm = await createCommunication({
    ...parsed.data,
    tenantId: auth.user.tenantId,
    createdById: auth.user.id,
  });

  return NextResponse.json({ data: comm }, { status: 201 });
}
