import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { store } from "@/lib/db";
import type { Role } from "@/types";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-dev-secret-change-in-production-please"
);
const COOKIE_NAME = "sc-ops-session";
const SESSION_DURATION_HOURS = 24;

export interface SessionUser {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: Role;
}

export interface Session {
  user: SessionUser;
  expiresAt: number;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ user, tenantId: user.tenantId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_HOURS}h`)
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_HOURS * 60 * 60,
    path: "/",
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function authenticate(email: string, password: string, tenantId: string = "santos"): Promise<SessionUser | null> {
  const user = await store.users.findByEmail(email);
  if (!user) return null;

  // Check if user belongs to the given tenant
  if (user.tenantId !== tenantId) return null;

  // Check if user is active
  if ((user as any).isActive === false) return null;

  // Check password: prefer real bcrypt hash from DB
  const passwordHash = (user as any).passwordHash;
  if (passwordHash) {
    const ok = await verifyPassword(password, passwordHash);
    if (!ok) return null;
  } else {
    // No hash set (mock mode or new user) — fall back to a hardcoded default
    // for backward compatibility with the seeded demo data
    if (password !== "demo" && password !== "He@lInd!a2026") return null;
  }

  // Update lastActiveAt (fire and forget)
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/db");
      await prisma.user.update({
        where: { id: user.id, tenantId },
        data: { lastActiveAt: new Date() },
      });
    } catch (err) {
      // ignore
    }
  }

  return {
    id: user.id,
    tenantId: user.tenantId,
    email: user.email,
    name: user.name,
    role: user.role as Role,
  };
}

export function hasRole(session: Session | null, ...allowedRoles: Role[]): boolean {
  if (!session) return false;
  return allowedRoles.includes(session.user.role);
}
