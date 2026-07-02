import { NextResponse } from "next/server";
import { store } from "@/lib/db";

/**
 * File upload endpoint.
 *
 * For a quick win, we accept the file and return metadata + a base64 data URL
 * stored in the `filePath` field. This works without external storage.
 *
 * For production with large files, swap this with Supabase Storage / S3 / R2.
 *
 * Accepts: multipart/form-data with file + patientId / partnerId / title / category
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Limit: 5 MB (for base64 in DB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max 5 MB. For larger files, configure Supabase Storage.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const title = (formData.get("title") as string) || file.name;
    const category = (formData.get("category") as string) || "Uncategorized";
    const patientId = (formData.get("patientId") as string) || null;
    const partnerId = (formData.get("partnerId") as string) || null;
    const isPublic = formData.get("isPublic") === "true";
    const uploadedById = (formData.get("uploadedById") as string) || "1";

    const doc = await store.documents.create({
      title,
      category,
      filePath: dataUrl,
      fileType: file.type,
      size: file.size,
      patientId,
      partnerId,
      uploadedById,
      isPublic,
    } as any);

    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
