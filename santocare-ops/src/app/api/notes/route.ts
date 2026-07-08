import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { createNote, listNotes } from "@/services/notes.service";

const ListQuerySchema = z.object({
  patientId: z.string().optional(),
  partnerId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const CreateNoteSchema = z.object({
  content: z.string().min(1),
  patientId: z.string().optional().nullable(),
  partnerId: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "note:read");
  if (!auth.ok) return auth.response;

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", details: parsed.error.flatten() }, { status: 400 });
  }

  const result = await listNotes(auth.user.tenantId, parsed.data);
  return NextResponse.json({ data: result.data, meta: { total: result.total, page: result.page, limit: result.pageSize, totalPages: result.totalPages } });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "note:create");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = CreateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  const note = await createNote({
    ...parsed.data,
    tenantId: auth.user.tenantId,
    createdById: auth.user.id,
  });

  return NextResponse.json({ data: note }, { status: 201 });
}
