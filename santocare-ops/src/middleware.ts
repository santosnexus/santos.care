import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const AUTH_USER = process.env.OPS_AUTH_USER || "santos";
const AUTH_PASS = process.env.OPS_AUTH_PASS || "He@lInd!a2026";
const COOKIE_NAME = "sc-ops-session";

function isPublicPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/leads/capture") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/login"
  );
}

function checkBasicAuth(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  const decoded = atob(encoded);
  const i = decoded.indexOf(":");
  const user = decoded.slice(0, i);
  const pass = decoded.slice(i + 1);
  return user === AUTH_USER && pass === AUTH_PASS;
}

async function checkSessionAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const session = await verifySessionToken(token);
  return !!session;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Try session-based auth first
  const hasSession = await checkSessionAuth(req);
  if (hasSession) {
    return NextResponse.next();
  }

  // Fall back to Basic Auth (for legacy compatibility)
  const hasBasicAuth = checkBasicAuth(req.headers.get("authorization"));
  if (hasBasicAuth) {
    return NextResponse.next();
  }

  // API routes return 401 JSON, page routes show login page
  if (pathname.startsWith("/api/")) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication required" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate": 'Basic realm="SantoCare Ops", charset="UTF-8"',
        },
      }
    );
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="SantoCare Ops", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
