import { NextResponse } from "next/server";
import { store, isMockMode } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let partners = await store.partners.list();
    if (category) partners = partners.filter((p: any) => p.category === category);
    if (status) partners = partners.filter((p: any) => p.agreementStatus === status);

    return NextResponse.json({ partners, total: partners.length, mockMode: isMockMode });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await store.partners.create(body);
    return NextResponse.json({ partner: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
  }
}
