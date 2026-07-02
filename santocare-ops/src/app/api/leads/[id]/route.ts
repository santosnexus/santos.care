import { NextResponse } from "next/server";
import { store } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const lead = await store.leads.find(params.id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await store.leads.update(params.id, body);
    if (!updated) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json({ lead: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await store.leads.delete(params.id);
  return NextResponse.json({ success: true });
}
