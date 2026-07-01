import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME?.trim() || 'dore_session';
const DEFAULT_SESSION_TTL_DAYS = 30;
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS);
const SESSION_MAX_AGE_SECONDS =
  60 *
  60 *
  24 *
  (Number.isFinite(SESSION_TTL_DAYS) && SESSION_TTL_DAYS > 0
    ? SESSION_TTL_DAYS
    : DEFAULT_SESSION_TTL_DAYS);

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function createSessionToken() {
  return randomBytes(32).toString('base64url');
}

export function sessionExpiresAt() {
  return new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
}

export async function createUserSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = sessionExpiresAt();
  await prisma.userSession.create({
    data: {
      userId,
      sessionTokenHash: hashSessionToken(token),
      expiresAt,
    },
  });
  setSessionCookie(token, expiresAt);
  return token;
}

export function setSessionCookie(token: string, expiresAt: Date) {
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
    expires: expiresAt,
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function getSessionTokenFromCookie() {
  return cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function deleteCurrentSession() {
  const token = getSessionTokenFromCookie();
  if (token) {
    await prisma.userSession.deleteMany({
      where: { sessionTokenHash: hashSessionToken(token) },
    });
  }
  clearSessionCookie();
}
