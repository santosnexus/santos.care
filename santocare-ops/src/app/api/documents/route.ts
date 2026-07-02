import { NextResponse } from "next/server";
import { store, isMockMode } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isPublic = searchParams.get("isPublic");

    let documents = await store.documents.list();
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
    const created = await store.documents.create(body);
    return NextResponse.json({ document: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
