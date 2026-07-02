import { PrismaClient } from "@prisma/client";

export interface AuditLogEntry {
  tenantId: string;
  userId?: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entityType: string;
  entityId: string;
  before?: Record<string, any> | null;
  after?: Record<string, any> | null;
  ipAddress?: string;
  userAgent?: string;
}

export async function writeAuditLog(prisma: PrismaClient, entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
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
    console.error("Failed to write audit log:", error);
  }
}

export async function getAuditLogs(
  prisma: PrismaClient,
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
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: options?.limit || 50,
      skip: options?.offset || 0,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total };
}
