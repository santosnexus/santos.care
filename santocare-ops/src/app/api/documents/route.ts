import { NextResponse } from "next/server";
import { store, isMockMode } from "@/lib/db";

async function getTenantId(request: Request): Promise<string | null> {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenantId") || request.headers.get("x-tenant-id");
  return tenantId || null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isPublic = searchParams.get("isPublic");
    const tenantId = await getTenantId(request);

    let documents = await store.documents.list();

    if (tenantId) {
      documents = (documents as any[]).filter((d: any) => d.tenantId === tenantId);
    }

    if (category) documents = documents.filter((d: any) => d.category === category);
    if (isPublic !== null) {
      const wantPublic = isPublic === "true";
      documents = documents.filter((d: any) => d.isPublic === wantPublic);
    }

    documents.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ documents, total: documents.length, mockMode: isMockMode });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tenantId = body.tenantId || "santos";

    const created = await store.documents.create({...body, tenantId});
    return NextResponse.json({ document: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
