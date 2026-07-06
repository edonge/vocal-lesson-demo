import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { toAuthUser } from '@/lib/api/user-response';
import { withServerTiming } from '@/lib/api/timing';

export const dynamic = 'force-dynamic';

export async function GET() {
  return withServerTiming('auth:session', async () => {
    const user = await getCurrentUser();
    return NextResponse.json({ user: user ? toAuthUser(user) : null });
  });
}
