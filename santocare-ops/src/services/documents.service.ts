import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";

export interface CreateDocumentInput {
  tenantId: string;
  title: string;
  category: string;
  filePath: string;
  fileType?: string | null;
  size?: number | null;
  patientId?: string | null;
  partnerId?: string | null;
  uploadedById: string;
  isPublic?: boolean;
}

export async function createDocument(input: CreateDocumentInput) {
  const doc = await prisma.document.create({
    data: {
      tenantId: input.tenantId,
      title: input.title,
      category: input.category,
      filePath: input.filePath,
      fileType: input.fileType || null,
      size: input.size || null,
      patientId: input.patientId || null,
      partnerId: input.partnerId || null,
      uploadedById: input.uploadedById,
      isPublic: input.isPublic ?? false,
    },
    include: {
      uploadedBy: { select: { name: true } },
      patient: { select: { name: true } },
      partner: { select: { name: true } },
    },
  });

  await logAudit({
    tenantId: input.tenantId,
    userId: input.uploadedById,
    action: "CREATE",
    entityType: "Document",
    entityId: doc.id,
    after: { title: doc.title, category: doc.category },
  });

  return doc;
}

export async function getDocument(tenantId: string, id: string) {
  return prisma.document.findFirst({
    where: { id, tenantId },
    include: {
      uploadedBy: { select: { name: true } },
      patient: { select: { name: true } },
      partner: { select: { name: true } },
    },
  });
}

export async function deleteDocument(tenantId: string, id: string, deletedById: string) {
  const before = await prisma.document.findUnique({ where: { id, tenantId } });
  if (!before) throw new Error("Document not found");

  await prisma.document.delete({ where: { id, tenantId } });

  await logAudit({
    tenantId, userId: deletedById, action: "DELETE", entityType: "Document", entityId: id, before: { title: before.title },
  });
}

export async function listDocuments(
  tenantId: string,
  opts: {
    category?: string;
    patientId?: string;
    partnerId?: string;
    isPublic?: boolean;
    search?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { category, patientId, partnerId, isPublic, search, page = 1, pageSize = 50 } = opts;

  const where: any = { tenantId };
  if (category) where.category = category;
  if (patientId) where.patientId = patientId;
  if (partnerId) where.partnerId = partnerId;
  if (isPublic !== undefined) where.isPublic = isPublic;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        uploadedBy: { select: { name: true } },
      },
    }),
    prisma.document.count({ where }),
  ]);

  return { data: items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
