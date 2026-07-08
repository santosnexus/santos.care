import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { getQuote, updateQuote, deleteQuote } from "@/services/quotes.service";

const UpdateQuoteSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED", "EXPIRED", "CONVERTED"]).optional(),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  validUntil: z.string().datetime().optional().nullable(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  treatmentPlan: z.string().optional().nullable(),
  hospitalName: z.string().optional().nullable(),
  lineItems: z.array(z.object({
    description: z.string().min(1),
    quantity: z.coerce.number().min(0.01),
    unitPrice: z.coerce.number().min(0),
    category: z.enum(["SURGERY", "HOSPITAL", "HOTEL", "TRANSPORT", "VISA", "SERVICE", "OTHER"]).optional(),
  })).optional(),
}).strict();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "quote:read");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const quote = await getQuote(auth.user.tenantId, id);
  if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  return NextResponse.json({ data: quote });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "quote:update");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = UpdateQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const updated = await updateQuote(auth.user.tenantId, id, parsed.data, auth.user.id);
    return NextResponse.json({ data: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update quote" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "quote:delete");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    await deleteQuote(auth.user.tenantId, id, auth.user.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to delete quote" }, { status: 400 });
  }
}
