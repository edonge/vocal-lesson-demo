import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { prisma } from '@/lib/db';
import {
  makeTrainerPreviewInclude,
  toTrainerPreview,
} from '@/lib/api/trainers';
import { withServerTiming } from '@/lib/api/timing';
import type { ApiHomeResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  return withServerTiming('home', async () => {
    const user = await getCurrentUser();
    const previewInclude = makeTrainerPreviewInclude(user?.id);

    // student(선택), banners, trainers 를 병렬로. 지역 필터는 응답 시점에 정렬로 처리해서
    // "지역 매칭 → 없으면 전체" 두 번 쿼리하던 것을 한 번으로 통합.
    const [student, banners, dorePick] = await Promise.all([
      user
        ? prisma.studentProfile.findUnique({
            where: { userId: user.id },
            select: {
              districtId: true,
              lessonGoalId: true,
              birthYear: true,
              district: { select: { name: true } },
            },
          })
        : Promise.resolve(null),
      prisma.banner.findMany({
        where: { status: 'published' },
        orderBy: { sortOrder: 'asc' },
        take: 5,
      }),
      prisma.trainerProfile.findMany({
        where: { isPublished: true },
        include: previewInclude,
        orderBy: [{ sortOrder: 'asc' }],
        take: 10,
      }),
    ]);

    // 학생 지역이 있으면 같은 지역을 앞으로 정렬.
    const visiblePick = student?.districtId
      ? [...dorePick].sort((a, b) => {
          const aMatch = a.districtId === student.districtId ? 0 : 1;
          const bMatch = b.districtId === student.districtId ? 0 : 1;
          if (aMatch !== bMatch) return aMatch - bMatch;
          return a.sortOrder - b.sortOrder;
        })
      : dorePick;

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
      dorePick: visiblePick.map((trainer) => toTrainerPreview(trainer, user?.id)),
      userDistrict: student?.district?.name ?? null,
      profilePrompt: {
        show: missing.length > 0,
        missing,
      },
    };

    return NextResponse.json(response);
  });
}
