import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { createInvoice, listInvoices } from "@/services/invoices.service";

const ListQuerySchema = z.object({
  patientId: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const LineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.coerce.number().min(0.01),
  unitPrice: z.coerce.number().min(0),
  category: z.enum(["SURGERY", "HOSPITAL", "HOTEL", "TRANSPORT", "VISA", "SERVICE", "OTHER"]).optional(),
  refId: z.string().optional().nullable(),
});

const CreateInvoiceSchema = z.object({
  patientId: z.string().min(1),
  lineItems: z.array(LineItemSchema).min(1),
  currency: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  dueDate: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "invoice:read");
  if (!auth.ok) return auth.response;

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", details: parsed.error.flatten() }, { status: 400 });
  }

  const result = await listInvoices(auth.user.tenantId, {
    patientId: parsed.data.patientId,
    status: parsed.data.status as any,
    search: parsed.data.search,
    page: parsed.data.page,
    pageSize: parsed.data.limit,
  });

  return NextResponse.json({ data: result.data, meta: { total: result.total, page: result.page, limit: result.pageSize, totalPages: result.totalPages } });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "invoice:create");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = CreateInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  const invoice = await createInvoice({
    ...parsed.data,
    tenantId: auth.user.tenantId,
    createdById: auth.user.id,
  });

  return NextResponse.json({ data: invoice }, { status: 201 });
}
