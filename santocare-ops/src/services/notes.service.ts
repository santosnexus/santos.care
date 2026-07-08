import { prisma } from "@/lib/db";

export interface CreateNoteInput {
  tenantId: string;
  content: string;
  patientId?: string | null;
  partnerId?: string | null;
  createdById: string;
}

export async function createNote(input: CreateNoteInput) {
  return prisma.note.create({
    data: {
      tenantId: input.tenantId,
      content: input.content,
      patientId: input.patientId || null,
      partnerId: input.partnerId || null,
      createdById: input.createdById,
    },
    include: {
      createdBy: { select: { name: true } },
    },
  });
}

export async function listNotes(
  tenantId: string,
  opts: {
    patientId?: string;
    partnerId?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { patientId, partnerId, page = 1, pageSize = 50 } = opts;

  const where: any = { tenantId };
  if (patientId) where.patientId = patientId;
  if (partnerId) where.partnerId = partnerId;

  const [items, total] = await Promise.all([
    prisma.note.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { createdBy: { select: { name: true } } },
    }),
    prisma.note.count({ where }),
  ]);

  return { data: items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
