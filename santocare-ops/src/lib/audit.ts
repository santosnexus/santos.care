import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";

export interface AuditLogEntry {
  tenantId: string;
  userId?: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "EXPORT";
  entityType: string;
  entityId: string;
  before?: Record<string, any> | null;
  after?: Record<string, any> | null;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog(prismaClient: PrismaClient, entry: AuditLogEntry): Promise<void> {
  try {
    await prismaClient.auditLog.create({
      data: {
        tenantId: entry.tenantId,
        userId: entry.userId || undefined,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        before: entry.before || undefined,
        after: entry.after || undefined,
        ipAddress: entry.ipAddress || undefined,
        userAgent: entry.userAgent || undefined,
      },
    });
  } catch (error) {
    // Audit log writes should never fail the main operation
    logger.error("Failed to write audit log", error);
  }
}

export async function getAuditLogs(
  prismaClient: PrismaClient,
  tenantId: string,
  options?: {
    entityType?: string;
    entityId?: string;
    userId?: string;
    action?: string;
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const where: any = { tenantId };

  if (options?.entityType) where.entityType = options.entityType;
  if (options?.entityId) where.entityId = options.entityId;
  if (options?.userId) where.userId = options.userId;
  if (options?.action) where.action = options.action;

  if (options?.startDate || options?.endDate) {
    where.createdAt = {};
    if (options.startDate) where.createdAt.gte = options.startDate;
    if (options.endDate) where.createdAt.lte = options.endDate;
  }

  const [logs, total] = await Promise.all([
    prismaClient.auditLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    }),
    prismaClient.auditLog.count({ where }),
  ]);

  return { logs, total };
}

// ─── Singleton convenience wrappers (used by service layer) ───────────────────

/**
 * Log a mutation (CREATE / UPDATE / DELETE).
 * Uses the singleton prisma instance. Never throws.
 */
export async function logAudit(entry: Omit<AuditLogEntry, "userId"> & { userId: string }): Promise<void> {
  return writeAuditLog(prisma as unknown as PrismaClient, entry);
}

/**
 * Log a read access event for compliance.
 */
export async function logAccess(input: {
  tenantId: string;
  userId: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
}): Promise<void> {
  return logAudit({
    ...input,
    action: "VIEW",
  });
}
