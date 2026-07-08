import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { getOrCreateItinerary, listUpcomingEvents, getPatientItinerary } from "@/services/itinerary.service";

const CreateItinerarySchema = z.object({
  patientId: z.string().min(1),
});

const ListEventsSchema = z.object({
  patientId: z.string().optional(),
  days: z.coerce.number().int().min(1).max(365).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requirePermission(req, "itinerary:read");
  if (!auth.ok) return auth.response;

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  if (params.patientId) {
    const itinerary = await getPatientItinerary(auth.user.tenantId, params.patientId);
    return NextResponse.json({ data: itinerary ?? null });
  }

  const parsed = ListEventsSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query", details: parsed.error.flatten() }, { status: 400 });
  }

  const events = await listUpcomingEvents(auth.user.tenantId, parsed.data);
  return NextResponse.json({ data: events });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "itinerary:create");
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = CreateItinerarySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  const itinerary = await getOrCreateItinerary({
    ...parsed.data,
    tenantId: auth.user.tenantId,
    createdById: auth.user.id,
  });

  return NextResponse.json({ data: itinerary }, { status: 201 });
}
