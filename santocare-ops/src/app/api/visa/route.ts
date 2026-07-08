import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { listVisaApplications, createVisaApplication } from "@/services/visa.service";

const ListQuerySchema = z.object({
  patientId: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

const CreateVisaSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  type: z.enum(["MEDICAL", "TOURIST", "ATTENDANT", "BUSINESS"]).default("MEDICAL"),
  country: z.string().min(1, "Country is required"),
  embassy: z.string().optional().nullable(),
  applicationDate: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  attendantCount: z.coerce.number().int().min(0).default(0),
});

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "visa:read");
  if (!auth.ok) return auth.response;

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { applications, total } = await listVisaApplications(auth.user.tenantId, parsed.data);
  return NextResponse.json({ data: applications, meta: { total } });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "visa:create");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateVisaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const application = await createVisaApplication({
    ...parsed.data,
    tenantId: auth.user.tenantId,
    createdById: auth.user.id,
  });

  return NextResponse.json({ data: application }, { status: 201 });
}
