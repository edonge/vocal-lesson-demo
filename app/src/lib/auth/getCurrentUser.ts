import { prisma } from '@/lib/db';
import { getSessionTokenFromCookie, hashSessionToken } from '@/lib/auth/session';

export async function getCurrentUser() {
  const token = getSessionTokenFromCookie();
  if (!token) return null;

  const session = await prisma.userSession.findUnique({
    where: { sessionTokenHash: hashSessionToken(token) },
    include: {
      user: {
        include: {
          studentProfile: true,
        },
      },
    },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.userSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  if (session.user.status !== 'active') return null;

  return session.user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    const error = new Error('Unauthorized');
    error.name = 'UnauthorizedError';
    throw error;
  }
  return user;
}
