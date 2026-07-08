import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth";
import { createDocument } from "@/services/documents.service";

export async function POST(req: NextRequest) {
  const auth = await requirePermission(req, "document:create");
  if (!auth.ok) return auth.response;

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Max 5 MB." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  const title = (formData.get("title") as string) || file.name;
  const category = (formData.get("category") as string) || "Uncategorized";
  const patientId = formData.get("patientId") as string | null;
  const partnerId = formData.get("partnerId") as string | null;
  const isPublic = formData.get("isPublic") === "true";

  const doc = await createDocument({
    tenantId: auth.user.tenantId,
    title,
    category,
    filePath: dataUrl,
    fileType: file.type,
    size: file.size,
    patientId,
    partnerId,
    uploadedById: auth.user.id,
    isPublic,
  });

  return NextResponse.json({ data: doc }, { status: 201 });
}
