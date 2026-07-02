import { NextResponse } from "next/server";
import { store, isMockMode } from "@/lib/db";

async function getTenantId(request: Request): Promise<string | undefined> {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenantId") || request.headers.get("x-tenant-id");
  return tenantId || undefined;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const tenantId = await getTenantId(request);

    let leads = await store.leads.list(tenantId);

    if (status) leads = leads.filter((l: any) => l.status === status);
    if (source) leads = leads.filter((l: any) => l.source === source);

    leads.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ leads, total: leads.length, mockMode: isMockMode });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tenantId = body.tenantId || "santos";

    const newLead = {
      tenantId,
      source: body.source || "WEBSITE",
      campaign: body.campaign,
      name: body.name,
      country: body.country,
      email: body.email,
      phone: body.phone,
      status: "NEW",
      treatmentInterest: body.treatmentInterest,
      budgetRange: body.budgetRange,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
    };

    const created = await store.leads.create(newLead);
    return NextResponse.json({ lead: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
