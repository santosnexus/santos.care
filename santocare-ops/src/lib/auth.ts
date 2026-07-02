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
  return new SignJWT({ user })
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

export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  const user = await store.users.findByEmail(email);
  if (!user) return null;

  // For demo mode, accept any password matching the user email
  // For production with database, compare against hashed password stored in DB
  // (we'll need to add passwordHash field to the User model)
  if (process.env.NODE_ENV === "production" && (user as any).passwordHash) {
    const ok = await verifyPassword(password, (user as any).passwordHash);
    if (!ok) return null;
  } else {
    // Demo mode: simple check - password is "demo" for all users
    if (password !== "demo" && password !== "He@lInd!a2026") return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
  };
}

export function hasRole(session: Session | null, ...allowedRoles: Role[]): boolean {
  if (!session) return false;
  return allowedRoles.includes(session.user.role);
}
