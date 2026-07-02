import { NextResponse } from "next/server";
import { store } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const patient = await store.patients.find(params.id);
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  return NextResponse.json({ patient });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await store.patients.update(params.id, body);
    if (!updated) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    return NextResponse.json({ patient: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const deleted = await store.patients.delete(params.id);
  return NextResponse.json({ patient: deleted });
}
