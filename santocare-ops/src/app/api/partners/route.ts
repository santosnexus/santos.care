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
    const status = searchParams.get("status");
    const tenantId = await getTenantId(request);

    let partners = await store.partners.list();

    if (tenantId) {
      partners = (partners as any[]).filter((p: any) => p.tenantId === tenantId);
    }

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
    const tenantId = body.tenantId || "santos";

    const created = await store.partners.create({...body, tenantId});
    return NextResponse.json({ partner: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
  }
}
