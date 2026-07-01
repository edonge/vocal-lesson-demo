import { NextResponse } from 'next/server';
import { jsonError } from '@/lib/api/request';
import { verifyPassword } from '@/lib/auth/password';
import { createUserSession } from '@/lib/auth/session';
import { normalizeLoginId } from '@/lib/auth/validation';
import { toAuthUser } from '@/lib/api/user-response';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    loginId?: string;
    password?: string;
  } | null;
  const loginId = normalizeLoginId(body?.loginId);
  const password = body?.password ?? '';

  const user = await prisma.user.findUnique({ where: { loginId } });
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !valid || user.status !== 'active') {
    return jsonError('아이디 또는 비밀번호를 확인해주세요.', 401);
  }

  await createUserSession(user.id);
  return NextResponse.json({ user: toAuthUser(user) });
}
