import { NextResponse } from "next/server";

/**
 * Public lead capture endpoint on the public site.
 * Proxies submissions to the ops hub (or processes them locally if no OPS_HUB_URL set).
 *
 * This avoids CORS issues by being same-origin on santos.care.
 */
const OPS_HUB_URL = process.env.NEXT_PUBLIC_OPS_HUB_URL || process.env.OPS_HUB_URL || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // If ops hub is configured, forward the lead there
    if (OPS_HUB_URL) {
      try {
        const res = await fetch(`${OPS_HUB_URL}/api/leads/capture`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: body.name,
            email: body.email,
            phone: body.phone,
            country: body.country,
            treatmentInterest: body.treatmentInterest,
            budgetRange: body.budgetRange,
            source: body.source || "WEBSITE",
            campaign: body.campaign,
            utmSource: body.utmSource,
            utmMedium: body.utmMedium,
            utmCampaign: body.utmCampaign,
            message: body.message,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ success: true, lead: data.lead }, { status: 201 });
        }
      } catch (err) {
        // Fall through to local handling
        console.error("Failed to forward lead to ops hub:", err);
      }
    }

    // Local fallback: log the lead (in production, this would email/notify)
    console.log("Lead captured (no ops hub):", body);
    return NextResponse.json(
      {
        success: true,
        lead: { id: Date.now().toString(), name: body.name },
        fallback: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
