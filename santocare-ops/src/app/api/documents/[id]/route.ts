import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { getDocument, deleteDocument } from "@/services/documents.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "document:read");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const doc = await getDocument(auth.user.tenantId, id);
  if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  return NextResponse.json({ data: doc });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requirePermission(req, "document:delete");
  if (!auth.ok) return auth.response;

  const { id } = await params;
  try {
    await deleteDocument(auth.user.tenantId, id, auth.user.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Failed to delete document" }, { status: 400 });
  }
}
