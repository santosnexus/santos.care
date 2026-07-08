/**
 * GET    /api/leads/[id]  - Get a lead
 * PATCH  /api/leads/[id]  - Update a lead
 * DELETE /api/leads/[id]  - Soft-delete a lead
 *
 * POST /api/leads/[id]/convert  - Convert lead to patient (handled in /convert)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { getLead, updateLead, softDeleteLead } from "@/services/leads.service";

// ─── Patch schema ─────────────────────────────────────────────────────────────

const UpdateLeadSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    country: z.string().optional(),
    status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"]).optional(),
    treatmentInterest: z.string().optional(),
    budgetRange: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

// ─── GET /api/leads/[id] ─────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "lead:read");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const lead = await getLead(auth.user.tenantId, id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ data: lead });
}

// ─── PATCH /api/leads/[id] ────────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "lead:update");
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdateLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const updated = await updateLead(auth.user.tenantId, id, parsed.data, auth.user.id);
  return NextResponse.json({ data: updated });
}

// ─── DELETE /api/leads/[id] ───────────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission(req, "lead:delete");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await softDeleteLead(auth.user.tenantId, id, auth.user.id);

  return NextResponse.json({ success: true });
}
