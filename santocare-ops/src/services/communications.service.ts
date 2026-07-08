import { prisma } from "@/lib/db";
import type { CommType, CommDirection } from "@prisma/client";

export interface CreateCommunicationInput {
  tenantId: string;
  patientId: string;
  type: CommType;
  direction: CommDirection;
  content: string;
  createdById: string;
}

export async function createCommunication(input: CreateCommunicationInput) {
  const comm = await prisma.communication.create({
    data: {
      tenantId: input.tenantId,
      patientId: input.patientId,
      type: input.type,
      direction: input.direction,
      content: input.content,
      createdById: input.createdById,
    },
    include: {
      createdBy: { select: { name: true } },
      patient: { select: { name: true } },
    },
  });
  return comm;
}

export async function getCommunication(tenantId: string, id: string) {
  return prisma.communication.findFirst({
    where: { id, tenantId },
    include: {
      createdBy: { select: { name: true } },
      patient: { select: { name: true } },
    },
  });
}

export async function listCommunications(
  tenantId: string,
  opts: {
    patientId?: string;
    type?: CommType;
    direction?: CommDirection;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { patientId, type, direction, page = 1, pageSize = 50 } = opts;

  const where: any = { tenantId };
  if (patientId) where.patientId = patientId;
  if (type) where.type = type;
  if (direction) where.direction = direction;

  const [items, total] = await Promise.all([
    prisma.communication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        createdBy: { select: { name: true } },
        patient: { select: { name: true } },
      },
    }),
    prisma.communication.count({ where }),
  ]);

  return { data: items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
