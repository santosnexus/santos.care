/**
 * POST /api/leads/[id]/convert  - Convert a qualified lead into a patient
 */
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { convertLeadToPatient } from "@/services/leads.service";
import { inngest } from "@/inngest/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "lead:update");
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const { patient } = await convertLeadToPatient(auth.user.tenantId, id, auth.user.id);

  // Welcome the new patient
  await inngest
    .send({
      name: "patient/created",
      data: {
        patientId: patient.id,
        tenantId: patient.tenantId,
        name: patient.name,
        email: patient.email ?? "",
        phone: patient.phone,
        whatsapp: patient.whatsapp ?? null,
        referenceNumber: patient.referenceNumber,
        coordinatorId: patient.assignedCoordinatorId ?? null,
      },
    })
    .catch(() => {});

  return NextResponse.json({ data: { patient } }, { status: 201 });
}
