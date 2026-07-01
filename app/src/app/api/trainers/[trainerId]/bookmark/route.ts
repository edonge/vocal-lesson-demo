import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { jsonError, jsonUnauthorized } from '@/lib/api/request';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: Request,
  { params }: { params: { trainerId: string } }
) {
  const user = await getCurrentUser();
  if (!user) return jsonUnauthorized();
  const trainer = await prisma.trainerProfile.findUnique({
    where: { id: params.trainerId },
    select: { id: true },
  });
  if (!trainer) return jsonError('Trainer not found', 404);

  await prisma.bookmark.upsert({
    where: { userId_trainerId: { userId: user.id, trainerId: params.trainerId } },
    update: {},
    create: { userId: user.id, trainerId: params.trainerId },
  });

  return NextResponse.json({ bookmarked: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { trainerId: string } }
) {
  const user = await getCurrentUser();
  if (!user) return jsonUnauthorized();
  await prisma.bookmark.deleteMany({
    where: { userId: user.id, trainerId: params.trainerId },
  });

  return NextResponse.json({ bookmarked: false });
}
