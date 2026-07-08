import { NextRequest } from "next/server";

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  domain?: string | null;
  plan: "STARTER" | "PRO" | "ENTERPRISE";
  status: "ACTIVE" | "SUSPENDED" | "CANCELLED";
}

const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*/",
    "/api/((?!health|auth|leads).*)",
  ],
};

async function resolveTenantFromSubdomain(req: NextRequest): Promise<Tenant | null> {
  const hostname = req.headers.get("host")?.split(":")[0];
  if (!hostname) return null;

  const parts = hostname.split(".");
  const commonSubdomains = ["www", "app", "admin", "ops"];
  const isCommon = commonSubdomains.includes(parts[0]);

  let slug: string;
  if (hostname === "santos.care" || hostname === "santos-care.vercel.app") {
    slug = "santos";
  } else if (hostname === "santos-care-web.vercel.app") {
    slug = "santos";
  } else if (parts.length >= 2 && !isCommon) {
    slug = parts[0];
  } else {
    return null;
  }

  return { id: slug, slug, name: slug, domain: hostname, plan: "STARTER", status: "ACTIVE" };
}

async function resolveTenantFromDomain(domain: string, tenants: Tenant[]): Promise<Tenant | null> {
  const tenant = tenants.find((t) => t.domain === domain || t.slug === domain);
  return tenant || null;
}

async function resolveTenantFromHeader(req: NextRequest, tenants: Tenant[]): Promise<Tenant | null> {
  const header = req.headers.get("x-tenant-id");
  if (!header) return null;

  const tenant = tenants.find((t) => t.id === header || t.slug === header);
  return tenant || null;
}

async function resolveTenantFromJWT(token: string): Promise<Tenant | null> {
  try {
    const { jwtVerify } = await import("jose");
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || ""
    );

    const { payload } = await jwtVerify(token, secret);
    const tenantId = (payload as any).tenantId as string;

    if (!tenantId) return null;
    return {
      id: tenantId,
      slug: tenantId,
      name: tenantId,
      domain: null,
      plan: "STARTER",
      status: "ACTIVE",
    };
  } catch {
    return null;
  }
}

export async function tenantResolver(req: NextRequest, allTenants: Tenant[]): Promise<Tenant | null> {
  const { pathname } = req.nextUrl;

  const fromSubdomain = await resolveTenantFromSubdomain(req);
  if (fromSubdomain) return fromSubdomain;

  const fromHeader = await resolveTenantFromHeader(req, allTenants);
  if (fromHeader) return fromHeader;

  const cookieToken = req.cookies.get("sc-ops-session")?.value;
  if (cookieToken) {
    const fromJWT = await resolveTenantFromJWT(cookieToken);
    if (fromJWT) return fromJWT;
  }

  const queryTenantId = new URLSearchParams(req.nextUrl.search).get("tenantId");
  if (queryTenantId) {
    const fromQuery = await resolveTenantFromHeader(req, allTenants);
    if (fromQuery && fromQuery.id === queryTenantId) return fromQuery;
  }

  return null;
}

export function getConfig() {
  return config;
}
