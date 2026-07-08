/**
 * Partners service — all partner business logic lives here.
 */
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";
import type { PartnerCategory, AgreementStatus } from "@prisma/client";

export interface CreatePartnerInput {
  tenantId: string;
  name: string;
  category: PartnerCategory;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  website?: string | null;
  description?: string | null;
  specializations?: string[];
  agreementStatus?: AgreementStatus;
  agreementDate?: string | null;
  agreementExpiresAt?: string | null;
  commissionRate?: number | null;
  isPubliclyListed?: boolean;
  createdById: string;
}

export async function createPartner(input: CreatePartnerInput) {
  const { createdById, agreementDate, agreementExpiresAt, isPubliclyListed = false, ...rest } = input;

  // Generate unique slug if to be publicly listed
  let slug: string | undefined;
  if (isPubliclyListed) {
    slug = await generateUniqueSlug(rest.name);
  }

  const partner = await prisma.partner.create({
    data: {
      ...rest,
      isPubliclyListed,
      slug: slug || null,
      agreementDate: agreementDate ? new Date(agreementDate) : null,
      agreementExpiresAt: agreementExpiresAt ? new Date(agreementExpiresAt) : null,
      specializations: rest.specializations || [],
    },
  });

  await logAudit({
    tenantId: input.tenantId,
    userId: createdById,
    action: "CREATE",
    entityType: "Partner",
    entityId: partner.id,
    after: partner,
  });

  return partner;
}

export async function updatePartner(
  tenantId: string,
  id: string,
  data: Partial<Omit<CreatePartnerInput, "tenantId" | "createdById">>,
  updatedById: string
) {
  const before = await prisma.partner.findUnique({ where: { id, tenantId } });
  if (!before) throw new Error("Partner not found");
  if (before.deletedAt) throw new Error("Partner has been deleted");

  const { agreementDate, agreementExpiresAt, isPubliclyListed, ...rest } = data;

  let slug = before.slug;
  // Generate slug if going public for the first time
  if (isPubliclyListed === true && !before.isPubliclyListed && !before.slug) {
    slug = await generateUniqueSlug(rest.name || before.name);
  }

  const partner = await prisma.partner.update({
    where: { id, tenantId },
    data: {
      ...rest,
      ...(isPubliclyListed !== undefined ? { isPubliclyListed, slug } : {}),
      ...(agreementDate !== undefined
        ? { agreementDate: agreementDate ? new Date(agreementDate) : null }
        : {}),
      ...(agreementExpiresAt !== undefined
        ? { agreementExpiresAt: agreementExpiresAt ? new Date(agreementExpiresAt) : null }
        : {}),
    },
  });

  await logAudit({
    tenantId,
    userId: updatedById,
    action: "UPDATE",
    entityType: "Partner",
    entityId: id,
    before,
    after: partner,
  });

  return partner;
}

export async function softDeletePartner(
  tenantId: string,
  id: string,
  deletedById: string
) {
  const partner = await prisma.partner.findUnique({ where: { id, tenantId } });
  if (!partner) throw new Error("Partner not found");
  if (partner.deletedAt) throw new Error("Partner already deleted");

  const deleted = await prisma.partner.update({
    where: { id, tenantId },
    data: { deletedAt: new Date(), isPubliclyListed: false },
  });

  await logAudit({
    tenantId,
    userId: deletedById,
    action: "DELETE",
    entityType: "Partner",
    entityId: id,
    before: partner,
  });

  return deleted;
}

export async function listPartners(
  tenantId: string,
  opts: {
    category?: PartnerCategory;
    agreementStatus?: AgreementStatus;
    search?: string;
    page?: number;
    pageSize?: number;
    includeDeleted?: boolean;
    isPubliclyListed?: boolean;
    expiringInDays?: number;
  } = {}
) {
  const {
    category,
    agreementStatus,
    search,
    page = 1,
    pageSize = 20,
    includeDeleted = false,
    isPubliclyListed,
    expiringInDays,
  } = opts;

  const where: any = {
    tenantId,
    ...(!includeDeleted ? { deletedAt: null } : {}),
    ...(category ? { category } : {}),
    ...(agreementStatus ? { agreementStatus } : {}),
    ...(isPubliclyListed !== undefined ? { isPubliclyListed } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { contactPerson: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(expiringInDays !== undefined
      ? {
          agreementExpiresAt: {
            gte: new Date(),
            lte: new Date(Date.now() + expiringInDays * 86_400_000),
          },
        }
      : {}),
  };

  const [partners, total] = await Promise.all([
    prisma.partner.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.partner.count({ where }),
  ]);

  return { partners, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getPartner(tenantId: string, id: string) {
  return prisma.partner.findFirst({
    where: { id, tenantId, deletedAt: null },
    include: {
      notes: { orderBy: { createdAt: "desc" }, take: 10, include: { createdBy: { select: { name: true } } } },
      documents: { orderBy: { createdAt: "desc" }, take: 10 },
      _count: { select: { itineraryEvents: true } },
    },
  });
}

export async function listPartnersExpiringSoon(tenantId: string, withinDays: number = 30) {
  return listPartners(tenantId, { expiringInDays: withinDays, includeDeleted: false });
}

export async function getPartnerPublic(slug: string) {
  return prisma.partner.findUnique({
    where: { slug, isPubliclyListed: true, deletedAt: null },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      specializations: true,
      address: true,
      website: true,
      phone: true,
      email: true,
      satisfactionScore: true,
      totalPatientsReferred: true,
    },
  });
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name);
  const existing = await prisma.partner.findMany({
    where: { slug: { startsWith: base } },
    select: { slug: true },
  });
  if (!existing.length) return base;
  // Append a counter if slug exists
  const suffixes = existing
    .map((p: { slug: string | null }) => p.slug?.replace(base, "").replace("-", ""))
    .filter((s): s is string => Boolean(s))
    .map((s: string) => Number(s))
    .filter((n: number) => !isNaN(n));
  const max = suffixes.length ? Math.max(...suffixes) : 0;
  return `${base}-${max + 1}`;
}
