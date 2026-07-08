/**
 * GET  /api/partners  - List partners
 * POST /api/partners  - Create a partner
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { createPartner, listPartners } from "@/services/partners.service";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  agreementStatus: z.string().optional(),
  country: z.string().optional(),
  deletedOnly: z.coerce.boolean().default(false),
});

const CreatePartnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["HOSPITAL", "AYURVEDA", "LAB", "TRANSPORT", "NURSING", "EQUIPMENT"]),
  country: z.string().optional(),
  city: z.string().optional(),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  specialities: z.array(z.string()).optional(),
  commissionRate: z.coerce.number().min(0).max(100).optional(),
  agreementStatus: z.enum(["NONE", "PENDING", "SIGNED", "EXPIRED"]).default("PENDING"),
  agreementStart: z.string().datetime().optional(),
  agreementExpiry: z.string().datetime().optional(),
  isPubliclyListed: z.boolean().default(false),
  notes: z.string().optional(),
});

// ─── GET /api/partners ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "partner:read");
  if (!auth.ok) return auth.response;

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { page, limit, search, category, agreementStatus, country, deletedOnly } = parsed.data;

  const { partners, total } = await listPartners(auth.user.tenantId, {
    page,
    pageSize: limit,
    search,
    category: category as any,
    agreementStatus: agreementStatus as any,
    includeDeleted: deletedOnly,
  });

  return NextResponse.json({
    data: partners,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

// ─── POST /api/partners ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "partner:create");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreatePartnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const partner = await createPartner({
    ...parsed.data,
    email: parsed.data.email || undefined,
    website: parsed.data.website || undefined,
    tenantId: auth.user.tenantId,
    createdById: auth.user.id,
  });

  return NextResponse.json({ data: partner }, { status: 201 });
}
