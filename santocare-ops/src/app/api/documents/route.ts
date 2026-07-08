import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { createDocument, listDocuments } from "@/services/documents.service";

const ListQuerySchema = z.object({
  category: z.string().optional(),
  patientId: z.string().optional(),
  partnerId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const CreateDocumentSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  filePath: z.string().min(1),
  fileType: z.string().optional().nullable(),
  size: z.coerce.number().int().optional().nullable(),
  patientId: z.string().optional().nullable(),
  partnerId: z.string().optional().nullable(),
  isPublic: z.coerce.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "document:read");
  if (!auth.ok) return auth.response;

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", details: parsed.error.flatten() }, { status: 400 });
  }

  const result = await listDocuments(auth.user.tenantId, parsed.data);
  return NextResponse.json({ data: result.data, meta: { total: result.total, page: result.page, limit: result.pageSize, totalPages: result.totalPages } });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "document:create");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = CreateDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  const doc = await createDocument({
    ...parsed.data,
    tenantId: auth.user.tenantId,
    uploadedById: auth.user.id,
  });

  return NextResponse.json({ data: doc }, { status: 201 });
}
