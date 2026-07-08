import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth";
import { updateEvent, deleteEvent } from "@/services/itinerary.service";

const UpdateEventSchema = z.object({
  type: z.enum(["FLIGHT", "HOTEL", "PROCEDURE", "CONSULTATION", "DISCHARGE", "VISA", "TRANSPORT", "OTHER"]).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  date: z.string().optional(),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  partnerId: z.string().optional().nullable(),
  status: z.enum(["PLANNED", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  order: z.coerce.number().int().min(0).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  const auth = await requirePermission(req, "itinerary:update");
  if (!auth.ok) return auth.response;

  const { eventId } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = UpdateEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const event = await updateEvent(auth.user.tenantId, eventId, {
      ...parsed.data,
      updatedById: auth.user.id,
    });
    return NextResponse.json({ data: event });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to update event" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  const auth = await requirePermission(req, "itinerary:delete");
  if (!auth.ok) return auth.response;

  const { eventId } = await params;
  try {
    await deleteEvent(auth.user.tenantId, eventId, auth.user.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to delete event" }, { status: 400 });
  }
}
