import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { tenantResolver, Tenant } from "@/lib/tenant";

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
  try {
    const decoded = atob(encoded);
    const i = decoded.indexOf(":");
    const user = decoded.slice(0, i);
    const pass = decoded.slice(i + 1);
    return user === AUTH_USER && pass === AUTH_PASS;
  } catch {
    return false;
  }
}

async function checkSessionAuth(req: NextRequest): Promise<{ valid: boolean; tenantId?: string }> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return { valid: false };
  const session = await verifySessionToken(token);
  if (!session) return { valid: false };
  return { valid: true, tenantId: session.user?.tenantId };
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Tenant resolution
  const allTenants = [
    { id: "santos", slug: "santos", name: "Santos Care", domain: null, plan: "STARTER" as const, status: "ACTIVE" as const },
  ];

  const tenant = await tenantResolver(req, allTenants);

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Try session-based auth first
  const sessionAuth = await checkSessionAuth(req);
  if (sessionAuth.valid) {
    const response = NextResponse.next();
    // Inject tenant ID into request headers for API routes
    const tenantId = tenant?.id || sessionAuth.tenantId || "santos";
    response.headers.set("x-tenant-id", tenantId);
    return response;
  }

  // Fall back to Basic Auth (for legacy compatibility)
  const hasBasicAuth = checkBasicAuth(req.headers.get("authorization"));
  if (hasBasicAuth) {
    const response = NextResponse.next();
    // Inject default tenant for Basic Auth users
    const tenantId = tenant?.id || "santos";
    response.headers.set("x-tenant-id", tenantId);
    return response;
  }

  // API routes return 401 JSON
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // Page routes: redirect to login (no WWW-Authenticate header to avoid browser native dialog)
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
