import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import {
  getPartner,
  updatePartner,
  softDeletePartner,
  listPartners,
} from "@/services/partners.service";

const UpdatePartnerSchema = z
  .object({
    name: z.string().min(1).optional(),
    category: z.enum(["HOSPITAL", "AYURVEDA", "LAB", "TRANSPORT", "NURSING", "EQUIPMENT"]).optional(),
    contactPerson: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().email().optional().nullable().or(z.literal("")),
    address: z.string().optional().nullable(),
    website: z.string().url().optional().nullable().or(z.literal("")),
    description: z.string().optional().nullable(),
    specializations: z.array(z.string()).optional(),
    agreementStatus: z.enum(["NONE", "PENDING", "SIGNED", "EXPIRED"]).optional(),
    agreementDate: z.string().datetime().optional().nullable(),
    agreementExpiresAt: z.string().datetime().optional().nullable(),
    commissionRate: z.coerce.number().min(0).max(100).optional().nullable(),
    isPubliclyListed: z.boolean().optional(),
    slug: z.string().optional().nullable(),
  })
  .strict();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "partner:read");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const partner = await getPartner(auth.user.tenantId, id);
  if (!partner) {
    return NextResponse.json({ error: "Partner not found" }, { status: 404 });
  }
  return NextResponse.json({ data: partner });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "partner:update");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = UpdatePartnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const updated = await updatePartner(auth.user.tenantId, id, parsed.data, auth.user.id);
    return NextResponse.json({ data: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update partner" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "partner:delete");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    await softDeletePartner(auth.user.tenantId, id, auth.user.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to delete partner" }, { status: 400 });
  }
}