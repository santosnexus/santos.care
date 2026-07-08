import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/api-helpers";
import { store, isMockMode } from "@/lib/db";

export const GET = requirePermission("task:read")(async (req, ctx) => {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const assignedToId = searchParams.get("assignedToId");
  const priority = searchParams.get("priority");

  let tasks = await store.tasks.list();

  tasks = (tasks as any[]).filter((t: any) => t.tenantId === ctx.tenantId);

  if (status) tasks = tasks.filter((t: any) => t.status === status);
  if (assignedToId) tasks = tasks.filter((t: any) => t.assignedToId === assignedToId);
  if (priority) tasks = tasks.filter((t: any) => t.priority === priority);

  tasks.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return NextResponse.json({ tasks, total: tasks.length, mockMode: isMockMode });
});

export const POST = requirePermission("task:create")(async (req, ctx) => {
  const body = await req.json();

  const newTask = {
    tenantId: ctx.tenantId,
    title: body.title,
    description: body.description,
    type: body.type || "GENERAL",
    patientId: body.patientId,
    assignedToId: body.assignedToId,
    createdById: body.createdById || "1",
    status: "PENDING",
    priority: body.priority || "MEDIUM",
    dueDate: body.dueDate,
    recurring: body.recurring,
  };

  const created = await store.tasks.create(newTask);
  return NextResponse.json({ task: created }, { status: 201 });
});
