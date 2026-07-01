import { NextResponse } from 'next/server';
import { jsonError } from '@/lib/api/request';
import { normalizeLoginId, validateLoginId } from '@/lib/auth/validation';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { loginId?: string } | null;
  const loginId = normalizeLoginId(body?.loginId);
  const validationError = validateLoginId(loginId);
  if (validationError) return jsonError(validationError, 400);

  const existing = await prisma.user.findUnique({
    where: { loginId },
    select: { id: true },
  });

  return NextResponse.json({ available: !existing });
}
