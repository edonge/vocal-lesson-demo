import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const current = await getCurrentUser();
  const user = await prisma.user.findUnique({
    where: { id: current.id },
    include: {
      studentProfile: {
        include: {
          district: true,
          neighborhood: true,
          lessonGoal: true,
          genres: { include: { genre: true } },
        },
      },
    },
  });

  return NextResponse.json({
    id: user?.id,
    role: user?.role,
    name: user?.name,
    phone: user?.phone,
    studentProfile: user?.studentProfile
      ? {
          gender: user.studentProfile.gender,
          birthYear: user.studentProfile.birthYear,
          region: {
            district: user.studentProfile.district?.name ?? null,
            neighborhood: user.studentProfile.neighborhood?.name ?? null,
          },
          skillLevel: user.studentProfile.skillLevel,
          lessonGoal: user.studentProfile.lessonGoal?.name ?? null,
          genres: user.studentProfile.genres.map((item) => item.genre.name),
          admissionMajor: user.studentProfile.admissionMajor,
          eventDate: user.studentProfile.eventDate?.toISOString().slice(0, 10) ?? null,
          eventSongName: user.studentProfile.eventSongName,
          auditionDirection: user.studentProfile.auditionDirection,
          otherLessonDescription: user.studentProfile.otherLessonDescription,
          mainConcern: user.studentProfile.mainConcern,
          intro: user.studentProfile.intro,
          profileCompletionScore: user.studentProfile.profileCompletionScore,
        }
      : null,
  });
}
