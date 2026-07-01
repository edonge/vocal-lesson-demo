import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { prisma } from '@/lib/db';
import { trainerPreviewInclude, toTrainerPreview } from '@/lib/api/trainers';
import type { ApiHomeResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  const student = user
    ? await prisma.studentProfile.findUnique({
        where: { userId: user.id },
        include: { district: true, lessonGoal: true },
      })
    : null;

  const banners = await prisma.banner.findMany({
    where: { status: 'published' },
    orderBy: { sortOrder: 'asc' },
    take: 5,
  });

  const dorePick = await prisma.trainerProfile.findMany({
    where: {
      isPublished: true,
      ...(student?.districtId ? { districtId: student.districtId } : {}),
    },
    include: trainerPreviewInclude,
    orderBy: [{ sortOrder: 'asc' }],
    take: 10,
  });

  const fallbackPick =
    dorePick.length > 0
      ? dorePick
      : await prisma.trainerProfile.findMany({
          where: { isPublished: true },
          include: trainerPreviewInclude,
          orderBy: [{ sortOrder: 'asc' }],
          take: 10,
        });

  const missing = user
    ? [
        !student?.districtId ? '레슨 지역' : null,
        !student?.lessonGoalId ? '레슨 목표' : null,
        !student?.birthYear ? '출생연도' : null,
      ].filter((item): item is string => Boolean(item))
    : [];

  const response: ApiHomeResponse = {
    banners: banners.map((banner) => ({
      id: banner.id,
      title: banner.title,
      imageUrl: banner.imageUrl,
      bgColor: banner.bgColor,
      linkUrl: banner.linkUrl,
    })),
    dorePick: fallbackPick.map((trainer) => toTrainerPreview(trainer, user?.id)),
    profilePrompt: {
      show: missing.length > 0,
      missing,
    },
  };

  return NextResponse.json(response);
}
