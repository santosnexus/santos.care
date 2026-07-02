import { NextResponse } from "next/server";
import { store } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const document = await store.documents.find(id);
  if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  return NextResponse.json({ document });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await store.documents.delete(id);
  return NextResponse.json({ success: true, id });
}
