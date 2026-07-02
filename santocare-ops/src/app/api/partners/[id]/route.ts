import { NextResponse } from "next/server";
import { store } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const partner = await store.partners.find(id);
  if (!partner) return NextResponse.json({ error: "Partner not found" }, { status: 404 });
  return NextResponse.json({ partner });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await store.partners.update(id, body);
    if (!updated) return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    return NextResponse.json({ partner: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await store.partners.delete(id);
  return NextResponse.json({ success: true, id });
}
