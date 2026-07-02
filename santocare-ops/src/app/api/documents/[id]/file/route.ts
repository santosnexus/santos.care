import { NextResponse } from "next/server";
import { store } from "@/lib/db";

/**
 * View/download a document by ID.
 * Returns the file content with appropriate Content-Type header.
 */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const doc = await store.documents.find(params.id);
  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const filePath = (doc as any).filePath;
  const fileType = (doc as any).fileType || "application/octet-stream";

  if (filePath?.startsWith("data:")) {
    // Parse data URL
    const match = filePath.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const base64 = match[2];
      const buffer = Buffer.from(base64, "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `inline; filename="${(doc as any).title}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }
  }

  // For external URLs, redirect
  if (filePath?.startsWith("http")) {
    return NextResponse.redirect(filePath);
  }

  return NextResponse.json({ error: "File format not supported" }, { status: 400 });
}
