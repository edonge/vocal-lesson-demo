import { NextResponse } from 'next/server';
import type { Gender, SkillLevel } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

type StudentProfilePatch = {
  name?: string;
  gender?: Gender | '남성' | '여성' | '선택 안 함' | null;
  birthYear?: number | string | null;
  district?: string | null;
  neighborhood?: string | null;
  skillLevel?: SkillLevel | '입문' | '초급' | '중급' | '상급' | null;
  lessonGoal?: string | null;
  genres?: string[];
  admissionMajor?: string | null;
  eventDate?: string | null;
  eventSongName?: string | null;
  auditionDirection?: string | null;
  otherLessonDescription?: string | null;
  mainConcern?: string | null;
  intro?: string | null;
};

function normalizeGender(value: StudentProfilePatch['gender']): Gender | null {
  if (!value) return null;
  if (value === '남성') return 'male';
  if (value === '여성') return 'female';
  if (value === '선택 안 함') return 'none';
  if (value === 'male' || value === 'female' || value === 'none') return value;
  return null;
}

function normalizeSkill(value: StudentProfilePatch['skillLevel']): SkillLevel | null {
  if (!value) return null;
  if (value === '입문') return 'beginner';
  if (value === '초급') return 'basic';
  if (value === '중급') return 'intermediate';
  if (value === '상급') return 'advanced';
  if (
    value === 'beginner' ||
    value === 'basic' ||
    value === 'intermediate' ||
    value === 'advanced'
  ) {
    return value;
  }
  return null;
}

function completionScore(body: StudentProfilePatch) {
  let score = 25;
  if (body.lessonGoal) score += 20;
  if (
    body.admissionMajor ||
    body.eventDate ||
    body.auditionDirection ||
    body.otherLessonDescription ||
    (body.genres && body.genres.length > 0) ||
    body.mainConcern
  ) {
    score += 25;
  }
  if (body.intro?.trim()) score += 30;
  return Math.min(score, 100);
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  const body = (await request.json().catch(() => ({}))) as StudentProfilePatch;

  const [district, lessonGoal, genreRows] = await Promise.all([
    body.district
      ? prisma.district.findUnique({ where: { name: body.district } })
      : Promise.resolve(null),
    body.lessonGoal
      ? prisma.lessonGoal.findUnique({ where: { name: body.lessonGoal } })
      : Promise.resolve(null),
    body.genres?.length
      ? prisma.genre.findMany({ where: { name: { in: body.genres } } })
      : Promise.resolve([]),
  ]);

  const neighborhood =
    district && body.neighborhood
      ? await prisma.neighborhood.findFirst({
          where: { districtId: district.id, name: body.neighborhood },
        })
      : null;

  if (body.name) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: body.name },
    });
  }

  const profile = await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: {
      gender: normalizeGender(body.gender),
      birthYear: body.birthYear ? Number(body.birthYear) : null,
      districtId: district?.id ?? null,
      neighborhoodId: neighborhood?.id ?? null,
      skillLevel: normalizeSkill(body.skillLevel),
      lessonGoalId: lessonGoal?.id ?? null,
      admissionMajor: body.admissionMajor ?? null,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      eventSongName: body.eventSongName ?? null,
      auditionDirection: body.auditionDirection ?? null,
      otherLessonDescription: body.otherLessonDescription ?? null,
      mainConcern: body.mainConcern ?? null,
      intro: body.intro ?? null,
      profileCompletionScore: completionScore(body),
      genres: body.genres
        ? {
            deleteMany: {},
            create: genreRows.map((genre) => ({ genreId: genre.id })),
          }
        : undefined,
    },
    create: {
      userId: user.id,
      gender: normalizeGender(body.gender),
      birthYear: body.birthYear ? Number(body.birthYear) : null,
      districtId: district?.id ?? null,
      neighborhoodId: neighborhood?.id ?? null,
      skillLevel: normalizeSkill(body.skillLevel),
      lessonGoalId: lessonGoal?.id ?? null,
      admissionMajor: body.admissionMajor ?? null,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      eventSongName: body.eventSongName ?? null,
      auditionDirection: body.auditionDirection ?? null,
      otherLessonDescription: body.otherLessonDescription ?? null,
      mainConcern: body.mainConcern ?? null,
      intro: body.intro ?? null,
      profileCompletionScore: completionScore(body),
      genres: {
        create: genreRows.map((genre) => ({ genreId: genre.id })),
      },
    },
    include: {
      district: true,
      neighborhood: true,
      lessonGoal: true,
      genres: { include: { genre: true } },
    },
  });

  return NextResponse.json({
    studentProfile: {
      gender: profile.gender,
      birthYear: profile.birthYear,
      region: {
        district: profile.district?.name ?? null,
        neighborhood: profile.neighborhood?.name ?? null,
      },
      skillLevel: profile.skillLevel,
      lessonGoal: profile.lessonGoal?.name ?? null,
      genres: profile.genres.map((item) => item.genre.name),
      admissionMajor: profile.admissionMajor,
      eventDate: profile.eventDate?.toISOString().slice(0, 10) ?? null,
      eventSongName: profile.eventSongName,
      auditionDirection: profile.auditionDirection,
      otherLessonDescription: profile.otherLessonDescription,
      mainConcern: profile.mainConcern,
      intro: profile.intro,
      profileCompletionScore: profile.profileCompletionScore,
    },
  });
}
