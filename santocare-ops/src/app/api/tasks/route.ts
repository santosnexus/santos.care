import { NextResponse } from "next/server";
import { store, isMockMode } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const assignedToId = searchParams.get("assignedToId");
    const priority = searchParams.get("priority");

    let tasks = await store.tasks.list();
    if (status) tasks = tasks.filter((t: any) => t.status === status);
    if (assignedToId) tasks = tasks.filter((t: any) => t.assignedToId === assignedToId);
    if (priority) tasks = tasks.filter((t: any) => t.priority === priority);

    tasks.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return NextResponse.json({ tasks, total: tasks.length, mockMode: isMockMode });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTask = {
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
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
