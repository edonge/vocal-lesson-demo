import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { csvParam, numberParam } from '@/lib/api/request';
import { prisma } from '@/lib/db';
import { trainerPreviewInclude, toTrainerPreview } from '@/lib/api/trainers';

export const dynamic = 'force-dynamic';

const sortMap = {
  recommended: [{ sortOrder: 'asc' }],
  price: [{ priceMonthly: 'asc' }],
  reviews: [{ reviewCount: 'desc' }],
  career: [{ careerYears: 'desc' }],
} satisfies Record<string, Prisma.TrainerProfileOrderByWithRelationInput[]>;

type SortOption = keyof typeof sortMap;

function normalizeSort(value: string | null): SortOption {
  if (value === 'price' || value === 'reviews' || value === 'career') return value;
  return 'recommended';
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const district = searchParams.get('district');
  const neighborhood = searchParams.get('neighborhood');
  const genres = csvParam(searchParams.get('genres'));
  const goals = csvParam(searchParams.get('goals'));
  const facilities = csvParam(searchParams.get('facilities'));
  const priceMin = numberParam(searchParams.get('priceMin'));
  const priceMax = numberParam(searchParams.get('priceMax'));
  const careerMin = numberParam(searchParams.get('careerMin'));
  const careerMax = numberParam(searchParams.get('careerMax'));
  const sort = normalizeSort(searchParams.get('sort'));

  const where: Prisma.TrainerProfileWhereInput = {
    isPublished: true,
    ...(district ? { district: { name: district } } : {}),
    ...(neighborhood ? { neighborhood: { name: neighborhood } } : {}),
    ...(genres.length > 0
      ? { genres: { some: { genre: { name: { in: genres } } } } }
      : {}),
    ...(goals.length > 0
      ? { goals: { some: { goal: { name: { in: goals } } } } }
      : {}),
    ...(facilities.length > 0
      ? {
          facilities: {
            some: { available: true, facility: { name: { in: facilities } } },
          },
        }
      : {}),
    ...(priceMin || priceMax
      ? {
          priceMonthly: {
            ...(priceMin ? { gte: priceMin * 10000 } : {}),
            ...(priceMax ? { lte: priceMax * 10000 } : {}),
          },
        }
      : {}),
    ...(careerMin || careerMax
      ? {
          careerYears: {
            ...(careerMin ? { gte: careerMin } : {}),
            ...(careerMax ? { lte: careerMax } : {}),
          },
        }
      : {}),
  };

  const [total, trainers] = await prisma.$transaction([
    prisma.trainerProfile.count({ where }),
    prisma.trainerProfile.findMany({
      where,
      include: trainerPreviewInclude,
      orderBy: sortMap[sort],
      take: 50,
    }),
  ]);

  return NextResponse.json({
    total,
    items: trainers.map((trainer) => toTrainerPreview(trainer, user.id)),
  });
}
