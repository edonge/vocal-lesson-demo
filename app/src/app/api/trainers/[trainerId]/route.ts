import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { jsonError } from '@/lib/api/request';
import {
  makeTrainerDetailInclude,
  toTrainerDetail,
} from '@/lib/api/trainers';
import { withServerTiming } from '@/lib/api/timing';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { trainerId: string } }
) {
  return withServerTiming(`trainer:${params.trainerId}`, async () => {
    const user = await getCurrentUser();
    const trainer = await prisma.trainerProfile.findUnique({
      where: { id: params.trainerId },
      include: makeTrainerDetailInclude(user?.id),
    });

    if (!trainer || !trainer.isPublished) {
      return jsonError('Trainer not found', 404);
    }

    return NextResponse.json(toTrainerDetail(trainer, user?.id));
  });
}
