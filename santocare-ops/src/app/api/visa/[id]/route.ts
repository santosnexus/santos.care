import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import {
  getVisaApplication,
  updateVisaApplication,
  deleteVisaApplication,
} from "@/services/visa.service";

const UpdateVisaSchema = z.object({
  type: z.enum(["MEDICAL", "TOURIST", "ATTENDANT", "BUSINESS"]).optional(),
  status: z.enum(["DOCUMENTS_COLLECTED", "SUBMITTED", "IN_REVIEW", "APPROVED", "STAMPED", "REJECTED", "CANCELLED"]).optional(),
  country: z.string().optional(),
  embassy: z.string().optional().nullable(),
  applicationDate: z.string().optional().nullable(),
  submittedDate: z.string().optional().nullable(),
  reviewedDate: z.string().optional().nullable(),
  decisionDate: z.string().optional().nullable(),
  visaExpiryDate: z.string().optional().nullable(),
  portOfEntry: z.string().optional().nullable(),
  frroRegistered: z.coerce.boolean().optional(),
  frroNumber: z.string().optional().nullable(),
  frroExpiryDate: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  attendantCount: z.coerce.number().int().min(0).optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requirePermission(req, "visa:read");
  if (!auth.ok) return auth.response;

  const application = await getVisaApplication(auth.user.tenantId, params.id);
  if (!application) {
    return NextResponse.json({ error: "Visa application not found" }, { status: 404 });
  }

  return NextResponse.json({ data: application });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requirePermission(req, "visa:update");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdateVisaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const application = await updateVisaApplication(auth.user.tenantId, params.id, {
      ...parsed.data,
      updatedById: auth.user.id,
    });
    return NextResponse.json({ data: application });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requirePermission(req, "visa:delete");
  if (!auth.ok) return auth.response;

  try {
    await deleteVisaApplication(auth.user.tenantId, params.id, auth.user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
