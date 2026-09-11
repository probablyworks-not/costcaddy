import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { sessions, type Session } from '@/db/schema';

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function authSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not set');
  return secret;
}

function sign(sessionId: string): string {
  return createHmac('sha256', authSecret()).update(sessionId).digest('base64url');
}

// The session id is the DB primary key; the cookie carries id + HMAC signature so a
// tampered cookie is rejected before it ever reaches the database (CLAUDE.md "signed-cookie sessions").
export function signSessionCookie(sessionId: string): string {
  return `${sessionId}.${sign(sessionId)}`;
}

export function verifySessionCookie(cookieValue: string): string | null {
  const dot = cookieValue.lastIndexOf('.');
  if (dot === -1) return null;
  const sessionId = cookieValue.slice(0, dot);
  const signature = cookieValue.slice(dot + 1);
  const expected = sign(sessionId);
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;
  return sessionId;
}

export async function createSession(
  userId: string,
  orgId: string,
): Promise<{ cookieValue: string; expiresAt: Date }> {
  const id = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.insert(sessions).values({ id, userId, orgId, expiresAt });
  return { cookieValue: signSessionCookie(id), expiresAt };
}

export async function getSession(cookieValue: string): Promise<Session | null> {
  const sessionId = verifySessionCookie(cookieValue);
  if (!sessionId) return null;
  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }
  return session;
}

export async function deleteSession(cookieValue: string): Promise<void> {
  const sessionId = verifySessionCookie(cookieValue);
  if (!sessionId) return;
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

// "End all sessions" (A3) — the signed-out auditor is refused on their very next request
// because every row backing their cookies is gone, not just the current one.
export async function endAllSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
