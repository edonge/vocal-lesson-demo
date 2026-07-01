import type { Prisma } from '@prisma/client';
import type { ApiTrainerDetail, ApiTrainerPreview } from '@/types/api';
import { daysAgoLabel, formatCareer, formatMonthlyPrice } from '@/lib/api/format';

export const trainerPreviewInclude = {
  district: true,
  neighborhood: true,
  genres: { include: { genre: true } },
  tags: { include: { tag: true } },
  bookmarks: true,
} satisfies Prisma.TrainerProfileInclude;

export const trainerDetailInclude = {
  district: true,
  neighborhood: true,
  genres: { include: { genre: true } },
  goals: { include: { goal: true } },
  tags: { include: { tag: true } },
  facilities: { include: { facility: true } },
  recommendedFor: { orderBy: { sortOrder: 'asc' } },
  educations: { orderBy: { sortOrder: 'asc' } },
  careers: { orderBy: { sortOrder: 'asc' } },
  works: { orderBy: { sortOrder: 'asc' } },
  media: { orderBy: { sortOrder: 'asc' } },
  reviews: { orderBy: { createdAt: 'desc' } },
  bookmarks: true,
} satisfies Prisma.TrainerProfileInclude;

type TrainerPreviewRow = Prisma.TrainerProfileGetPayload<{
  include: typeof trainerPreviewInclude;
}>;

type TrainerDetailRow = Prisma.TrainerProfileGetPayload<{
  include: typeof trainerDetailInclude;
}>;

export function toTrainerPreview(
  trainer: TrainerPreviewRow,
  currentUserId?: string
): ApiTrainerPreview {
  const firstGenre = trainer.genres[0]?.genre.name ?? 'Kpop';
  const location = trainer.district?.name ?? trainer.locationText ?? '서울';
  const tags = trainer.tags.map((item) => item.tag.name).slice(0, 3);

  return {
    id: trainer.id,
    name: trainer.displayName,
    location,
    genre: firstGenre,
    highlight: trainer.headline?.split('\n')[0] ?? '맞춤형 보컬 레슨',
    description: trainer.intro ?? trainer.lessonApproach ?? '',
    tags,
    career: formatCareer(trainer.careerYears),
    reviews: trainer.reviewCount,
    price: formatMonthlyPrice(trainer.priceMonthly),
    image: trainer.cardImageUrl ?? trainer.heroImageUrl,
    bookmarked: currentUserId
      ? trainer.bookmarks.some((bookmark) => bookmark.userId === currentUserId)
      : false,
  };
}

export function toTrainerDetail(
  trainer: TrainerDetailRow,
  currentUserId?: string
): ApiTrainerDetail {
  const genres = trainer.genres.map((item) => item.genre.name);
  const lessonInfo = [
    { label: '레슨 방식', value: trainer.lessonMethod ?? '1:1 개인 레슨' },
    {
      label: '레슨 시간',
      value: trainer.lessonMinutes ? `${trainer.lessonMinutes}분 (1회)` : '상담 후 결정',
    },
    { label: '주소', value: trainer.address ?? trainer.locationText ?? '상담 후 안내' },
    {
      label: '가격',
      value:
        trainer.priceVisibility === 'consult' || !trainer.priceMonthly
          ? '상담 후 결정'
          : `월 ${trainer.priceMonthly.toLocaleString('ko-KR')}원`,
    },
  ];

  return {
    id: trainer.id,
    name: trainer.displayName,
    genres,
    locationText: trainer.locationText ?? trainer.district?.name ?? '서울',
    heroImage: trainer.heroImageUrl,
    headline: trainer.headline?.split('\n').filter(Boolean) ?? [],
    careerLabel: `레슨 경력 ${trainer.careerYears}년+`,
    recommendedFor: trainer.recommendedFor.map((item) => item.body),
    lessonInfo,
    facilities: trainer.facilities.map((item) => ({
      label: item.facility.name,
      value: item.available
        ? item.facility.name === '주차공간'
          ? '가능'
          : '보유'
        : item.facility.name === '주차공간'
          ? '불가능'
          : '미보유',
      available: item.available,
    })),
    tags: trainer.tags.map((item) => item.tag.name),
    lessonApproach: trainer.lessonApproach ?? '',
    education: trainer.educations.map((item) => ({
      school: item.school,
      major: item.major ?? '',
    })),
    careers: trainer.careers.map((item) => ({
      period: item.period ?? '',
      title: item.title,
      detail: item.detail ?? '',
    })),
    extraInfo: trainer.extraInfo ?? '',
    works: trainer.works.map((item) => ({
      type: item.type,
      title: item.title,
      subtitle: item.subtitle,
      url: item.url,
    })),
    mediaPhotos: trainer.media
      .filter((item) => item.type === 'photo')
      .map((item) => item.title ?? item.url),
    mediaVideos: trainer.media
      .filter((item) => item.type === 'video')
      .map((item) => item.title ?? item.url),
    reviews: trainer.reviews.map((review) => ({
      id: review.id,
      name: review.displayName ?? '이**',
      region: review.regionLabel ?? '서울',
      body: review.body,
      ago: daysAgoLabel(review.createdAt),
      likes: review.likesCount,
      dislikes: review.dislikesCount,
      createdAt: review.createdAt.toISOString().slice(0, 10),
    })),
    bookmarked: currentUserId
      ? trainer.bookmarks.some((bookmark) => bookmark.userId === currentUserId)
      : false,
  };
}
