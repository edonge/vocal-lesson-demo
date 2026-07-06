import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { jsonUnauthorized } from '@/lib/api/request';
import { withServerTiming } from '@/lib/api/timing';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  return withServerTiming('me', async () => {
    const current = await getCurrentUser();
    if (!current) return jsonUnauthorized();

    // getCurrentUser 는 이미 name/phone 등을 갖고 있으니 재조회하지 않는다.
    // studentProfile 만 별도로 필요한 관계와 함께 로드.
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: current.id },
      include: {
        district: true,
        neighborhood: true,
        lessonGoal: true,
        genres: { include: { genre: true } },
      },
    });

    return NextResponse.json({
      id: current.id,
      role: current.role,
      name: current.name,
      phone: current.phone,
      studentProfile: studentProfile
        ? {
            gender: studentProfile.gender,
            birthYear: studentProfile.birthYear,
            region: {
              district: studentProfile.district?.name ?? null,
              neighborhood: studentProfile.neighborhood?.name ?? null,
            },
            skillLevel: studentProfile.skillLevel,
            lessonGoal: studentProfile.lessonGoal?.name ?? null,
            genres: studentProfile.genres.map((item) => item.genre.name),
            admissionMajor: studentProfile.admissionMajor,
            eventDate:
              studentProfile.eventDate?.toISOString().slice(0, 10) ?? null,
            eventSongName: studentProfile.eventSongName,
            auditionDirection: studentProfile.auditionDirection,
            otherLessonDescription: studentProfile.otherLessonDescription,
            mainConcern: studentProfile.mainConcern,
            intro: studentProfile.intro,
            profileCompletionScore: studentProfile.profileCompletionScore,
          }
        : null,
    });
  });
}
