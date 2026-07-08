import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { getInvoice, updateInvoice, deleteInvoice } from "@/services/invoices.service";

const UpdateInvoiceSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "VIEWED", "PARTIAL", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  lineItems: z.array(z.object({
    description: z.string().min(1),
    quantity: z.coerce.number().min(0.01),
    unitPrice: z.coerce.number().min(0),
    category: z.enum(["SURGERY", "HOSPITAL", "HOTEL", "TRANSPORT", "VISA", "SERVICE", "OTHER"]).optional(),
    refId: z.string().optional().nullable(),
  })).optional(),
}).strict();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "invoice:read");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const invoice = await getInvoice(auth.user.tenantId, id);
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  return NextResponse.json({ data: invoice });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "invoice:update");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = UpdateInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const updated = await updateInvoice(auth.user.tenantId, id, parsed.data, auth.user.id);
    return NextResponse.json({ data: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update invoice" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "invoice:delete");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    await deleteInvoice(auth.user.tenantId, id, auth.user.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to delete invoice" }, { status: 400 });
  }
}
