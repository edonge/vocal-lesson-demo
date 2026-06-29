import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { jsonError } from '@/lib/api/request';
import { trainerDetailInclude, toTrainerDetail } from '@/lib/api/trainers';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { trainerId: string } }
) {
  const user = await getCurrentUser();
  const trainer = await prisma.trainerProfile.findUnique({
    where: { id: params.trainerId },
    include: trainerDetailInclude,
  });

  if (!trainer || !trainer.isPublished) {
    return jsonError('Trainer not found', 404);
  }

  return NextResponse.json(toTrainerDetail(trainer, user.id));
}
