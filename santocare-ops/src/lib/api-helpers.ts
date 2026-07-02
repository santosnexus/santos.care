import { NextRequest, NextResponse } from "next/server";
import { getSession, Session, SessionUser } from "@/lib/auth";
import { can, hasPermission } from "@/lib/permissions";

export interface ApiContext {
  session: Session;
  user: SessionUser;
  tenantId: string;
}

export async function getApiContext(req: NextRequest): Promise<ApiContext | null> {
  const session = await getSession();
  if (!session) return null;

  const tenantId = req.headers.get("x-tenant-id") || session.user.tenantId || "santos";

  return {
    session,
    user: session.user,
    tenantId,
  };
}

type RouteHandler = (req: NextRequest, ctx: ApiContext) => Promise<NextResponse>;
type DynamicRouteHandler<T = {}> = (req: NextRequest, ctx: ApiContext, extra: { params: T }) => Promise<NextResponse>;

export function requireAuth(handler: RouteHandler) {
  return async (req: NextRequest) => {
    const ctx = await getApiContext(req);
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, ctx);
  };
}

export function requireAuthDynamic<T = {}>(handler: DynamicRouteHandler<T>) {
  return async (req: NextRequest, extra: { params: T }) => {
    const ctx = await getApiContext(req);
    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, ctx, extra);
  };
}

export function requirePermission(permission: string) {
  return (handler: RouteHandler) => {
    return async (req: NextRequest) => {
      const ctx = await getApiContext(req);
      if (!ctx) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!can(ctx.user, permission)) {
        return NextResponse.json({ error: "Forbidden", required: permission }, { status: 403 });
      }
      return handler(req, ctx);
    };
  };
}

export function requirePermissionDynamic<T = {}>(permission: string) {
  return (handler: DynamicRouteHandler<T>) => {
    return async (req: NextRequest, extra: { params: T }) => {
      const ctx = await getApiContext(req);
      if (!ctx) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!can(ctx.user, permission)) {
        return NextResponse.json({ error: "Forbidden", required: permission }, { status: 403 });
      }
      return handler(req, ctx, extra);
    };
  };
}

export function requireAnyPermission(...permissions: string[]) {
  return (handler: RouteHandler) => {
    return async (req: NextRequest) => {
      const ctx = await getApiContext(req);
      if (!ctx) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!hasPermission(ctx.user, ...permissions)) {
        return NextResponse.json({ error: "Forbidden", required: permissions }, { status: 403 });
      }
      return handler(req, ctx);
    };
  };
}

export function getTenantId(req: NextRequest): string {
  return req.headers.get("x-tenant-id") || "santos";
}
