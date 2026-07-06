import { cache } from 'react';
import { prisma } from '@/lib/db';
import { getSessionTokenFromCookie, hashSessionToken } from '@/lib/auth/session';

/**
 * 같은 요청 안에서 여러 번 호출되어도 실제 DB 조회는 1회.
 * (React `cache()` 는 request-scope memoization.)
 *
 * 대부분 route 는 user 만 필요하고 studentProfile 은 사용하지 않는다.
 * include 를 벗기고 필요한 필드만 select 해서 훨씬 가벼운 쿼리를 실행하고,
 * studentProfile 이 필요한 곳(/api/me, /api/home)은 각자 필요한 shape 으로 재조회한다.
 */
export const getCurrentUser = cache(async () => {
  const token = getSessionTokenFromCookie();
  if (!token) return null;

  const session = await prisma.userSession.findUnique({
    where: { sessionTokenHash: hashSessionToken(token) },
    select: {
      id: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          role: true,
          loginId: true,
          name: true,
          phone: true,
          email: true,
          status: true,
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
});

export const requireCurrentUser = cache(async () => {
  const user = await getCurrentUser();
  if (!user) {
    const error = new Error('Unauthorized');
    error.name = 'UnauthorizedError';
    throw error;
  }
  return user;
});
