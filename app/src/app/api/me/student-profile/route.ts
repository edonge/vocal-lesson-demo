import { NextResponse } from 'next/server';
import type { Gender, Prisma, SkillLevel } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { jsonUnauthorized } from '@/lib/api/request';
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

function hasOwn<Key extends keyof StudentProfilePatch>(
  body: StudentProfilePatch,
  key: Key
) {
  return Object.prototype.hasOwnProperty.call(body, key);
}

function completionScoreFromProfile(profile: {
  lessonGoalId: string | null;
  admissionMajor: string | null;
  eventDate: Date | null;
  auditionDirection: string | null;
  otherLessonDescription: string | null;
  mainConcern: string | null;
  intro: string | null;
  genres: Array<unknown>;
}) {
  let score = 25;
  if (profile.lessonGoalId) score += 20;
  if (
    profile.admissionMajor ||
    profile.eventDate ||
    profile.auditionDirection ||
    profile.otherLessonDescription ||
    profile.genres.length > 0 ||
    profile.mainConcern
  ) {
    score += 25;
  }
  if (profile.intro?.trim()) score += 30;
  return Math.min(score, 100);
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonUnauthorized();
  const body = (await request.json().catch(() => ({}))) as StudentProfilePatch;

  const [district, lessonGoal, genreRows] = await Promise.all([
    hasOwn(body, 'district') && body.district
      ? prisma.district.findUnique({ where: { name: body.district } })
      : Promise.resolve(null),
    hasOwn(body, 'lessonGoal') && body.lessonGoal
      ? prisma.lessonGoal.findUnique({ where: { name: body.lessonGoal } })
      : Promise.resolve(null),
    hasOwn(body, 'genres') && body.genres?.length
      ? prisma.genre.findMany({ where: { name: { in: body.genres } } })
      : Promise.resolve([]),
  ]);

  const neighborhood =
    hasOwn(body, 'neighborhood') && district && body.neighborhood
      ? await prisma.neighborhood.findFirst({
          where: { districtId: district.id, name: body.neighborhood },
        })
      : null;

  if (hasOwn(body, 'name') && body.name) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: body.name },
    });
  }

  const updateData: Prisma.StudentProfileUpdateInput = {
    ...(hasOwn(body, 'gender') ? { gender: normalizeGender(body.gender) } : {}),
    ...(hasOwn(body, 'birthYear')
      ? { birthYear: body.birthYear ? Number(body.birthYear) : null }
      : {}),
    ...(hasOwn(body, 'district') ? { district: district ? { connect: { id: district.id } } : { disconnect: true } } : {}),
    ...(hasOwn(body, 'neighborhood')
      ? { neighborhood: neighborhood ? { connect: { id: neighborhood.id } } : { disconnect: true } }
      : {}),
    ...(hasOwn(body, 'skillLevel') ? { skillLevel: normalizeSkill(body.skillLevel) } : {}),
    ...(hasOwn(body, 'lessonGoal')
      ? { lessonGoal: lessonGoal ? { connect: { id: lessonGoal.id } } : { disconnect: true } }
      : {}),
    ...(hasOwn(body, 'admissionMajor') ? { admissionMajor: body.admissionMajor ?? null } : {}),
    ...(hasOwn(body, 'eventDate')
      ? { eventDate: body.eventDate ? new Date(body.eventDate) : null }
      : {}),
    ...(hasOwn(body, 'eventSongName') ? { eventSongName: body.eventSongName ?? null } : {}),
    ...(hasOwn(body, 'auditionDirection')
      ? { auditionDirection: body.auditionDirection ?? null }
      : {}),
    ...(hasOwn(body, 'otherLessonDescription')
      ? { otherLessonDescription: body.otherLessonDescription ?? null }
      : {}),
    ...(hasOwn(body, 'mainConcern') ? { mainConcern: body.mainConcern ?? null } : {}),
    ...(hasOwn(body, 'intro') ? { intro: body.intro ?? null } : {}),
    ...(hasOwn(body, 'genres')
      ? {
          genres: {
            deleteMany: {},
            create: genreRows.map((genre) => ({ genreId: genre.id })),
          },
        }
      : {}),
  };

  const profile = await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: updateData,
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

  const nextScore = completionScoreFromProfile(profile);
  const savedProfile =
    profile.profileCompletionScore === nextScore
      ? profile
      : await prisma.studentProfile.update({
          where: { userId: user.id },
          data: { profileCompletionScore: nextScore },
          include: {
            district: true,
            neighborhood: true,
            lessonGoal: true,
            genres: { include: { genre: true } },
          },
        });

  return NextResponse.json({
    studentProfile: {
      gender: savedProfile.gender,
      birthYear: savedProfile.birthYear,
      region: {
        district: savedProfile.district?.name ?? null,
        neighborhood: savedProfile.neighborhood?.name ?? null,
      },
      skillLevel: savedProfile.skillLevel,
      lessonGoal: savedProfile.lessonGoal?.name ?? null,
      genres: savedProfile.genres.map((item) => item.genre.name),
      admissionMajor: savedProfile.admissionMajor,
      eventDate: savedProfile.eventDate?.toISOString().slice(0, 10) ?? null,
      eventSongName: savedProfile.eventSongName,
      auditionDirection: savedProfile.auditionDirection,
      otherLessonDescription: savedProfile.otherLessonDescription,
      mainConcern: savedProfile.mainConcern,
      intro: savedProfile.intro,
      profileCompletionScore: savedProfile.profileCompletionScore,
    },
  });
}
