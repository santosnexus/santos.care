/**
 * Tasks service — task management business logic.
 */
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import type { TaskStatus, TaskPriority, TaskType, RecurringType } from "@prisma/client";

export interface CreateTaskInput {
  tenantId: string;
  title: string;
  description?: string | null;
  type?: TaskType;
  patientId?: string | null;
  assignedToId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate: string;
  recurring?: RecurringType | null;
  createdById: string;
}

export async function createTask(input: CreateTaskInput) {
  const { createdById, dueDate, type, status, priority, recurring, ...rest } = input;

  const task = await prisma.task.create({
    data: {
      ...rest,
      createdById,
      type: type ?? "GENERAL",
      status: status ?? "PENDING",
      priority: priority ?? "MEDIUM",
      recurring: recurring ?? null,
      dueDate: new Date(dueDate),
    },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      patient: { select: { id: true, name: true, referenceNumber: true } },
    },
  });

  await logAudit({
    tenantId: input.tenantId,
    userId: createdById,
    action: "CREATE",
    entityType: "Task",
    entityId: task.id,
    after: task,
  });

  return task;
}

export async function updateTask(
  tenantId: string,
  id: string,
  data: Partial<Omit<CreateTaskInput, "tenantId" | "createdById">>,
  updatedById: string
) {
  const before = await prisma.task.findFirst({ where: { id, tenantId } });
  if (!before) throw new Error("Task not found");

  const { dueDate, ...rest } = data;

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...rest,
      ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
    },
    include: {
      assignedTo: { select: { id: true, name: true } },
    },
  });

  await logAudit({
    tenantId,
    userId: updatedById,
    action: "UPDATE",
    entityType: "Task",
    entityId: id,
    before,
    after: task,
  });

  return task;
}

export async function listTasks(
  tenantId: string,
  opts: {
    patientId?: string;
    assignedToId?: string;
    status?: string;
    overdue?: boolean;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { patientId, assignedToId, status, overdue, page = 1, pageSize = 20 } = opts;

  const where: any = {
    tenantId,
    ...(patientId ? { patientId } : {}),
    ...(assignedToId ? { assignedToId } : {}),
    ...(status ? { status } : {}),
    ...(overdue ? { dueDate: { lt: new Date() }, status: { not: "COMPLETED" } } : {}),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        assignedTo: { select: { id: true, name: true } },
        patient: { select: { id: true, name: true, referenceNumber: true } },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return { tasks, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
