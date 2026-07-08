/**
 * GET  /api/patients  - List patients (paginated + filterable)
 * POST /api/patients  - Create a new patient
 *
 * Auth: requirePermission — every route uses this.
 * Validation: zod — every route validates inputs.
 * Business logic: patients.service — routes are thin.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { createPatient, listPatients } from "@/services/patients.service";
import { inngest } from "@/inngest/client";

// ─── Query / body schemas ─────────────────────────────────────────────────────

const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  stage: z.string().optional(),
  country: z.string().optional(),
  coordinatorId: z.string().optional(),
  deletedOnly: z.coerce.boolean().default(false),
});

const CreatePatientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7, "Phone is required"),
  whatsapp: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  treatmentType: z.string().optional(),
  treatmentDescription: z.string().optional(),
  preferredHospital: z.string().optional(),
  estimatedCost: z.coerce.number().optional(),
  sourceOfReferral: z.string().optional(),
  coordinatorId: z.string().optional(),
  notes: z.string().optional(),
  budget: z.coerce.number().optional(),
  currency: z.string().default("USD"),
});

// ─── GET /api/patients ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "patient:read");
  if (!auth.ok) return auth.response;

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { page, limit, search, stage, country, coordinatorId, deletedOnly } = parsed.data;

  const { patients, total } = await listPatients(auth.user.tenantId, {
    page,
    pageSize: limit,
    search,
    stage,
    country,
    coordinatorId,
    includeDeleted: deletedOnly,
  });

  return NextResponse.json({
    data: patients,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

// ─── POST /api/patients ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "patient:create");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreatePatientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const patient = await createPatient({
    ...parsed.data,
    email: parsed.data.email || `noreply-${Date.now()}@santos.care`,
    tenantId: auth.user.tenantId,
    createdById: auth.user.id,
  });

  // Fire background welcome notification (non-blocking)
  await inngest.send({
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
  }).catch(() => {
    // Never block a successful patient creation due to notification failure
  });

  return NextResponse.json({ data: patient }, { status: 201 });
}
