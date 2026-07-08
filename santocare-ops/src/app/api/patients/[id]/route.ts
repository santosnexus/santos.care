/**
 * GET    /api/patients/[id]  - Get a single patient
 * PATCH  /api/patients/[id]  - Update a patient
 * DELETE /api/patients/[id]  - Soft-delete a patient
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import {
  getPatientWithHistory,
  updatePatient,
  softDeletePatient,
  changePatientStage,
} from "@/services/patients.service";
import { inngest } from "@/inngest/client";

// ─── Patch schema ─────────────────────────────────────────────────────────────

const UpdatePatientSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    country: z.string().optional(),
    treatmentType: z.string().optional(),
    treatmentDescription: z.string().optional(),
    preferredHospital: z.string().optional(),
    estimatedCost: z.coerce.number().optional(),
    coordinatorId: z.string().optional(),
    notes: z.string().optional(),
    // Stage transition — handled via changePatientStage
    stage: z.string().optional(),
    stageNote: z.string().optional(),
  })
  .strict();

// ─── GET /api/patients/[id] ───────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "patient:read");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const patient = await getPatientWithHistory(auth.user.tenantId, id);
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  return NextResponse.json({ data: patient });
}

// ─── PATCH /api/patients/[id] ─────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "patient:update");
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdatePatientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { stage, stageNote, ...fields } = parsed.data;

  // If stage is being changed, delegate to the stage-change service
  if (stage) {
    const patient = await changePatientStage(
      auth.user.tenantId,
      id,
      stage as any,
      stageNote ?? null,
      auth.user.id
    );

    // Trigger stage-change notification
    await inngest
      .send({
        name: "patient/stage-changed",
        data: {
          patientId: patient.id,
          tenantId: patient.tenantId,
          fromStage: patient.stage, // will be old stage before DB update
          toStage: stage,
          patientName: patient.name,
          patientEmail: patient.email ?? "",
          patientPhone: patient.phone,
          coordinatorId: patient.assignedCoordinatorId ?? null,
        },
      })
      .catch(() => {});

    // Also apply any non-stage field updates
    if (Object.keys(fields).length > 0) {
      const updated = await updatePatient({
        tenantId: auth.user.tenantId,
        id,
        data: fields,
        updatedById: auth.user.id,
      });
      return NextResponse.json({ data: updated });
    }

    return NextResponse.json({ data: patient });
  }

  const updated = await updatePatient({
    tenantId: auth.user.tenantId,
    id,
    data: fields,
    updatedById: auth.user.id,
  });
  return NextResponse.json({ data: updated });
}

// ─── DELETE /api/patients/[id] ────────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "patient:delete");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await softDeletePatient(auth.user.tenantId, id, auth.user.id);

  return NextResponse.json({ success: true }, { status: 200 });
}
