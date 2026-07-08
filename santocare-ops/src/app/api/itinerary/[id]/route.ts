import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { getItinerary, deleteItinerary, createEvent, getPatientItinerary } from "@/services/itinerary.service";

const CreateEventSchema = z.object({
  type: z.enum(["FLIGHT", "HOTEL", "PROCEDURE", "CONSULTATION", "DISCHARGE", "VISA", "TRANSPORT", "OTHER"]),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  date: z.string().min(1),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  partnerId: z.string().optional().nullable(),
  order: z.coerce.number().int().min(0).optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "itinerary:read");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const itinerary = await getItinerary(auth.user.tenantId, id);
  if (!itinerary) return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });

  return NextResponse.json({ data: itinerary });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "itinerary:create");
  if (!auth.ok) return auth.response;

  const { id: itineraryId } = await params;

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = CreateEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  const event = await createEvent({
    ...parsed.data,
    itineraryId,
    tenantId: auth.user.tenantId,
    createdById: auth.user.id,
  });

  return NextResponse.json({ data: event }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "itinerary:delete");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    await deleteItinerary(auth.user.tenantId, id, auth.user.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to delete itinerary" }, { status: 400 });
  }
}
