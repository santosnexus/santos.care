/**
 * GET  /api/leads  - List leads (paginated + filterable)
 * POST /api/leads  - Create a new lead
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { createLead, listLeads } from "@/services/leads.service";
import { inngest } from "@/inngest/client";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  minScore: z.coerce.number().optional(),
  sortBy: z.enum(["score", "createdAt", "name"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  deletedOnly: z.coerce.boolean().default(false),
});

const CreateLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  country: z.string().optional(),
  source: z.enum([
    "WHATSAPP",
    "WEBSITE",
    "FACEBOOK",
    "GOOGLE_ADS",
    "REFERRAL",
    "PARTNER_HOSPITAL",
    "EXHIBITION",
    "OTHER",
  ]),
  treatmentInterest: z.string().optional(),
  budgetRange: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  notes: z.string().optional(),
});

// ─── GET /api/leads ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "lead:read");
  if (!auth.ok) return auth.response;

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { page, limit, search, status, source, minScore, sortBy, sortDir, deletedOnly } =
    parsed.data;

  const { leads, total } = await listLeads(auth.user.tenantId, {
    page,
    pageSize: limit,
    search,
    status: status as any,
    source: source as any,
    includeDeleted: deletedOnly,
  });

  return NextResponse.json({
    data: leads,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

// ─── POST /api/leads ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "lead:create");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const lead = await createLead({
    ...parsed.data,
    email: parsed.data.email || undefined,
    tenantId: auth.user.tenantId,
    createdById: auth.user.id,
  });

  // Kick off drip email sequence
  await inngest
    .send({
      name: "lead/created",
      data: {
        leadId: lead.id,
        tenantId: lead.tenantId,
        name: lead.name,
        email: lead.email ?? null,
        phone: lead.phone ?? null,
        source: lead.source,
      },
    })
    .catch(() => {});

  return NextResponse.json({ data: lead }, { status: 201 });
}
