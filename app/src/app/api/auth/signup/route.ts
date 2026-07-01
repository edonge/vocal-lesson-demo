import { NextResponse } from 'next/server';
import { jsonError } from '@/lib/api/request';
import { createUserSession } from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth/password';
import { normalizeLoginId, sanitizePhone, validateLoginId, validatePassword } from '@/lib/auth/validation';
import { toAuthUser } from '@/lib/api/user-response';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

type SignupBody = {
  loginId?: string;
  password?: string;
  name?: string;
  phone?: string;
  termsAgreed?: boolean;
  privacyAgreed?: boolean;
  marketingAgreed?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as SignupBody | null;
  const loginId = normalizeLoginId(body?.loginId);
  const password = body?.password ?? '';
  const name = body?.name?.trim() ?? '';
  const phone = sanitizePhone(body?.phone);

  const loginIdError = validateLoginId(loginId);
  if (loginIdError) return jsonError(loginIdError, 400);
  const passwordError = validatePassword(password);
  if (passwordError) return jsonError(passwordError, 400);
  if (!name) return jsonError('이름을 입력해주세요.', 400);
  if (!phone) return jsonError('전화번호를 입력해주세요.', 400);
  if (!body?.termsAgreed || !body.privacyAgreed) {
    return jsonError('필수 약관에 동의해주세요.', 400);
  }

  const exists = await prisma.user.findUnique({ where: { loginId }, select: { id: true } });
  if (exists) return jsonError('이미 사용 중인 아이디입니다.', 409);

  const phoneExists = await prisma.user.findUnique({ where: { phone }, select: { id: true } });
  if (phoneExists) return jsonError('이미 가입된 전화번호입니다.', 409);

  const now = new Date();
  const user = await prisma.user.create({
    data: {
      role: 'student',
      loginId,
      passwordHash: await hashPassword(password),
      name,
      phone,
      termsAgreedAt: now,
      privacyAgreedAt: now,
      marketingAgreedAt: body.marketingAgreed ? now : null,
      studentProfile: {
        create: {
          profileCompletionScore: 0,
        },
      },
    },
  });

  await createUserSession(user.id);
  return NextResponse.json({ user: toAuthUser(user) }, { status: 201 });
}
