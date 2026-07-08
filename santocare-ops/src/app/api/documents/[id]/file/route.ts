import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDocument } from "@/services/documents.service";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doc = await getDocument(session.user.tenantId, id);
  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const filePath = doc.filePath;
  const fileType = doc.fileType || "application/octet-stream";

  if (filePath.startsWith("data:")) {
    const match = filePath.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const buffer = Buffer.from(match[2], "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `inline; filename="${doc.title}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }
  }

  if (filePath.startsWith("http")) {
    return NextResponse.redirect(filePath);
  }

  return NextResponse.json({ error: "File format not supported" }, { status: 400 });
}
