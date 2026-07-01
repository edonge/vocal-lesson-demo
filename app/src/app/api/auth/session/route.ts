import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { toAuthUser } from '@/lib/api/user-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user: user ? toAuthUser(user) : null });
}
