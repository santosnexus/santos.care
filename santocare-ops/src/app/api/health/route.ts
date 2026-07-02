import { NextResponse } from "next/server";
import { isDatabaseEnabled, isMockMode } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: isDatabaseEnabled ? "connected" : "mock-mode",
    mode: isMockMode ? "demo" : "production",
  });
}
