import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { createPayment, listPayments } from "@/services/payments.service";

const CreatePaymentSchema = z.object({
  amount: z.coerce.number().min(0.01),
  currency: z.string().optional(),
  method: z.enum(["BANK_TRANSFER", "CARD", "CASH", "CHEQUE", "INSURANCE", "OTHER"]).optional(),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "payment:read");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const payments = await listPayments(auth.user.tenantId, id);
  return NextResponse.json({ data: payments });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "payment:create");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = CreatePaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const payment = await createPayment({
      ...parsed.data,
      tenantId: auth.user.tenantId,
      invoiceId: id,
      recordedById: auth.user.id,
    });
    return NextResponse.json({ data: payment }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to record payment" }, { status: 400 });
  }
}
