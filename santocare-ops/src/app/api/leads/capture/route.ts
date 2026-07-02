import { NextResponse } from "next/server";
import { store } from "@/lib/db";

/**
 * Public lead capture endpoint.
 * Called by the public website (santos.care) to submit inquiries.
 * No auth required — but rate-limited in production.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Minimal validation
    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const lead = await store.leads.create({
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
    });

    return NextResponse.json(
      { success: true, lead: { id: lead.id, name: lead.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
