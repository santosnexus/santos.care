import { NextResponse } from "next/server";
import { store } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * Public lead capture endpoint.
 * Called by the public website (santos.care) to submit inquiries.
 * No auth required — but rate-limited in production.
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    const rl = rateLimit(`lead-capture:${ip}`);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

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
    logger.error("Lead capture error", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
