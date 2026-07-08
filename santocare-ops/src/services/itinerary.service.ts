import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import type { ItineraryEventType, EventStatus, Prisma } from "@prisma/client";

export interface CreateItineraryInput {
  tenantId: string;
  patientId: string;
  createdById: string;
}

export interface CreateEventInput {
  itineraryId: string;
  tenantId: string;
  type: ItineraryEventType;
  title: string;
  description?: string | null;
  date: string;
  location?: string | null;
  notes?: string | null;
  partnerId?: string | null;
  order?: number;
  createdById: string;
}

export interface UpdateEventInput {
  type?: ItineraryEventType;
  title?: string;
  description?: string | null;
  date?: string;
  location?: string | null;
  notes?: string | null;
  partnerId?: string | null;
  order?: number;
  status?: EventStatus;
  updatedById: string;
}

export async function getOrCreateItinerary(input: CreateItineraryInput) {
  const { tenantId, patientId, createdById } = input;
  let itinerary = await prisma.itinerary.findUnique({
    where: { patientId },
    include: {
      events: {
        orderBy: { date: "asc" },
        include: { partner: { select: { id: true, name: true, category: true } } },
      },
      patient: { select: { id: true, name: true, referenceNumber: true } },
    },
  });
  if (itinerary) return itinerary;
  itinerary = await prisma.itinerary.create({
    data: { tenantId, patientId },
    include: {
      events: {
        orderBy: { date: "asc" },
        include: { partner: { select: { id: true, name: true, category: true } } },
      },
      patient: { select: { id: true, name: true, referenceNumber: true } },
    },
  });
  await logAudit({
    tenantId, userId: createdById, action: "CREATE", entityType: "Itinerary",
    entityId: itinerary.id, after: { patientId },
  });
  return itinerary;
}

export async function getItinerary(tenantId: string, id: string) {
  return prisma.itinerary.findFirst({
    where: { id, tenantId },
    include: {
      events: {
        orderBy: { date: "asc" },
        include: { partner: { select: { id: true, name: true, category: true } } },
      },
      patient: { select: { id: true, name: true, referenceNumber: true, country: true } },
    },
  });
}

export async function getPatientItinerary(tenantId: string, patientId: string) {
  return prisma.itinerary.findFirst({
    where: { patientId, tenant: { id: tenantId } },
    include: {
      events: {
        orderBy: { date: "asc" },
        include: { partner: { select: { id: true, name: true, category: true } } },
      },
    },
  });
}

export async function deleteItinerary(tenantId: string, id: string, deletedById: string) {
  const before = await prisma.itinerary.findUnique({ where: { id, tenantId } });
  if (!before) throw new Error("Itinerary not found");
  await prisma.itineraryEvent.deleteMany({ where: { itineraryId: id } });
  await prisma.itinerary.delete({ where: { id, tenantId } });
  await logAudit({
    tenantId, userId: deletedById, action: "DELETE", entityType: "Itinerary",
    entityId: id, before,
  });
}

export async function createEvent(input: CreateEventInput) {
  const { createdById, tenantId, ...rest } = input;
  const maxOrder = await prisma.itineraryEvent.aggregate({
    where: { itineraryId: rest.itineraryId },
    _max: { order: true },
  });
  const event = await prisma.itineraryEvent.create({
    data: {
      ...rest,
      order: rest.order ?? (maxOrder._max.order ?? -1) + 1,
      date: new Date(rest.date),
    },
    include: { partner: { select: { id: true, name: true, category: true } } },
  });
  await logAudit({
    tenantId,
    userId: createdById,
    action: "CREATE",
    entityType: "ItineraryEvent",
    entityId: event.id,
    after: event,
  });
  return event;
}

export async function updateEvent(
  tenantId: string,
  eventId: string,
  input: UpdateEventInput
) {
  const { updatedById, ...data } = input;
  const before = await prisma.itineraryEvent.findFirst({
    where: { id: eventId, itinerary: { tenantId } },
  });
  if (!before) throw new Error("Event not found");
  const updateData: Prisma.ItineraryEventUpdateInput = {};
  if (data.type !== undefined) updateData.type = data.type;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.location !== undefined) updateData.location = data.location;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.partnerId !== undefined) {
    updateData.partner = data.partnerId
      ? { connect: { id: data.partnerId } }
      : { disconnect: true };
  }
  if (data.order !== undefined) updateData.order = data.order;
  if (data.status !== undefined) updateData.status = data.status;
  const event = await prisma.itineraryEvent.update({
    where: { id: eventId },
    data: updateData,
    include: { partner: { select: { id: true, name: true, category: true } } },
  });
  await logAudit({
    tenantId, userId: updatedById, action: "UPDATE", entityType: "ItineraryEvent",
    entityId: eventId, before, after: event,
  });
  return event;
}

export async function deleteEvent(tenantId: string, eventId: string, deletedById: string) {
  const before = await prisma.itineraryEvent.findFirst({
    where: { id: eventId, itinerary: { tenantId } },
  });
  if (!before) throw new Error("Event not found");
  await prisma.itineraryEvent.delete({ where: { id: eventId } });
  await logAudit({
    tenantId, userId: deletedById, action: "DELETE", entityType: "ItineraryEvent",
    entityId: eventId, before,
  });
}

export async function listUpcomingEvents(
  tenantId: string,
  opts: { patientId?: string; days?: number; limit?: number } = {}
) {
  const { patientId, days = 30, limit = 50 } = opts;
  const now = new Date();
  const until = new Date(Date.now() + days * 86_400_000);
  const where: Prisma.ItineraryEventWhereInput = {
    itinerary: { tenantId },
    date: { gte: now, lte: until },
    status: { notIn: ["CANCELLED"] },
  };
  if (patientId) where.itinerary = { ...(where.itinerary as any), patientId };
  return prisma.itineraryEvent.findMany({
    where,
    orderBy: { date: "asc" },
    take: limit,
    include: {
      itinerary: { select: { patient: { select: { id: true, name: true, referenceNumber: true } } } },
      partner: { select: { id: true, name: true, category: true } },
    },
  });
}
