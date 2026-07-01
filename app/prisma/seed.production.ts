import { PrismaClient } from '@prisma/client';
import {
  facilities,
  genres,
  goals,
  heroImage,
  locationSeed,
  neighborhoodId,
  tags,
  trainerImage,
  trainerSeed,
} from './seed';

const prisma = new PrismaClient();

async function seedReferenceData() {
  for (let index = 0; index < genres.length; index += 1) {
    const name = genres[index];
    await prisma.genre.upsert({
      where: { name },
      create: { id: `genre-${index + 1}`, name, sortOrder: index },
      update: { sortOrder: index },
    });
  }

  for (let index = 0; index < goals.length; index += 1) {
    const name = goals[index];
    await prisma.lessonGoal.upsert({
      where: { name },
      create: { id: `goal-${index + 1}`, name, sortOrder: index },
      update: { sortOrder: index },
    });
  }

  for (let index = 0; index < facilities.length; index += 1) {
    const name = facilities[index];
    await prisma.facility.upsert({
      where: { name },
      create: { id: `facility-${index + 1}`, name, sortOrder: index },
      update: { sortOrder: index },
    });
  }

  for (let index = 0; index < tags.length; index += 1) {
    const name = tags[index];
    await prisma.tag.upsert({
      where: { name },
      create: { id: `tag-${index + 1}`, name },
      update: {},
    });
  }

  for (const district of locationSeed) {
    await prisma.district.upsert({
      where: { name: district.name },
      create: { id: district.id, name: district.name },
      update: {},
    });

    for (const name of district.neighborhoods) {
      await prisma.neighborhood.upsert({
        where: {
          districtId_name: {
            districtId: district.id,
            name,
          },
        },
        create: {
          id: neighborhoodId(district.id, name),
          districtId: district.id,
          name,
        },
        update: {},
      });
    }
  }

  const banners = [
    { id: 'banner-1', title: 'Dore 신규 추천', bgColor: '#035ef3', sortOrder: 1 },
    { id: 'banner-2', title: '내 지역 인기 트레이너', bgColor: '#7aafff', sortOrder: 2 },
    { id: 'banner-3', title: '첫 상담 가이드', bgColor: '#111827', sortOrder: 3 },
    { id: 'banner-4', title: '발성 집중 레슨', bgColor: '#48d597', sortOrder: 4 },
    { id: 'banner-5', title: '이번 주 오픈 클래스', bgColor: '#f97316', sortOrder: 5 },
  ];

  for (const banner of banners) {
    await prisma.banner.upsert({
      where: { id: banner.id },
      create: { ...banner, status: 'published' },
      update: { ...banner, status: 'published' },
    });
  }
}

async function resetSeedTrainerRelations(trainerIds: string[]) {
  await prisma.reviewReaction.deleteMany({
    where: { review: { trainerId: { in: trainerIds } } },
  });
  await prisma.review.deleteMany({ where: { trainerId: { in: trainerIds } } });
  await prisma.trainerMedia.deleteMany({ where: { trainerId: { in: trainerIds } } });
  await prisma.trainerWork.deleteMany({ where: { trainerId: { in: trainerIds } } });
  await prisma.trainerCareer.deleteMany({ where: { trainerId: { in: trainerIds } } });
  await prisma.trainerEducation.deleteMany({ where: { trainerId: { in: trainerIds } } });
  await prisma.trainerRecommendedFor.deleteMany({ where: { trainerId: { in: trainerIds } } });
  await prisma.trainerFacility.deleteMany({ where: { trainerId: { in: trainerIds } } });
  await prisma.trainerTag.deleteMany({ where: { trainerId: { in: trainerIds } } });
  await prisma.trainerGoal.deleteMany({ where: { trainerId: { in: trainerIds } } });
  await prisma.trainerGenre.deleteMany({ where: { trainerId: { in: trainerIds } } });
}

async function seedTrainers() {
  const trainerIds = trainerSeed.map((trainer) => trainer.id);
  await resetSeedTrainerRelations(trainerIds);

  const genreRows = await prisma.genre.findMany();
  const goalRows = await prisma.lessonGoal.findMany();
  const tagRows = await prisma.tag.findMany();
  const facilityRows = await prisma.facility.findMany();

  const genreId = (name: string) => genreRows.find((item) => item.name === name)?.id;
  const goalId = (name: string) => goalRows.find((item) => item.name === name)?.id;
  const tagId = (name: string) => tagRows.find((item) => item.name === name)?.id;
  const facilityId = (name: string) => facilityRows.find((item) => item.name === name)?.id;

  for (let index = 0; index < trainerSeed.length; index += 1) {
    const trainer = trainerSeed[index];
    const scalarData = {
      displayName: trainer.name,
      heroImageUrl: heroImage,
      cardImageUrl: trainerImage,
      districtId: trainer.districtId,
      neighborhoodId: trainer.neighborhoodId,
      locationText: `${trainer.districtLabel} 연습실`,
      address: `서울특별시 ${trainer.districtLabel} 샘플로 ${index + 1}`,
      headline: trainer.headline,
      intro: trainer.intro,
      careerYears: trainer.careerYears,
      lessonMethod: '1:1 개인 레슨',
      lessonMinutes: 60,
      priceMonthly: trainer.priceMonthly,
      priceVisibility: 'public' as const,
      hasPracticeRoom: index % 3 !== 0,
      hasParking: index % 2 === 0,
      lessonApproach:
        'STEP 1. 보컬 진단 & 상담: 현재 노래 습관과 고민을 함께 확인합니다.\n\nSTEP 2. 기초 발성 & 호흡: 목을 조이지 않고 편안하게 소리 내는 법을 익힙니다.\n\nSTEP 3. 맞춤형 테크닉 적용: 고음, 음정, 감정 표현처럼 개인별 약점을 수업 안에서 바로 교정합니다.\n\nSTEP 4. 곡 적용 & 실전 연습: 배운 내용을 실제 곡에 적용하고 녹음 피드백까지 진행합니다.',
      extraInfo:
        '레슨은 수강생의 목표와 일정에 맞춰 유연하게 구성합니다. 수업 후에는 그날의 핵심 피드백과 개인 연습 방향을 정리해드립니다.',
      reviewCount: trainer.reviewCount,
      isPublished: true,
      sortOrder: index,
    };

    const relationData = {
      genres: {
        create: trainer.genreNames.flatMap((name) => {
          const id = genreId(name);
          return id ? [{ genreId: id }] : [];
        }),
      },
      goals: {
        create: trainer.goalNames.flatMap((name) => {
          const id = goalId(name);
          return id ? [{ goalId: id }] : [];
        }),
      },
      tags: {
        create: trainer.tagNames.flatMap((name) => {
          const id = tagId(name);
          return id ? [{ tagId: id }] : [];
        }),
      },
      facilities: {
        create: facilities.flatMap((name) => {
          const id = facilityId(name);
          if (!id) return [];
          const available =
            name === '연습실' ? index % 3 !== 0 : name === '주차공간' ? index % 2 === 0 : index % 4 === 0;
          return [{ facilityId: id, available }];
        }),
      },
      recommendedFor: {
        create: [
          'Kpop, 남자 R&B를 좋아하시는 분',
          '입시 · 오디션을 준비 중이신 분',
          '고음에서 자꾸 목이 쉬시는 분',
          '편안한 분위기의 레슨을 선호하시는 분',
        ].map((body, sortOrder) => ({ body, sortOrder })),
      },
      educations: {
        create: [{ school: '동아방송예술대학교 졸업', major: '실용음악 전공', sortOrder: 0 }],
      },
      careers: {
        create: [
          { period: '2020 ~ 현재', title: '보컬 레슨 6년+', detail: '취미 및 오디션 수강생 120명 이상 지도', sortOrder: 0 },
          { period: '2018 ~ 현재', title: '싱어송라이터 활동', detail: 'EP 발매 및 라이브 클럽 공연 다수', sortOrder: 1 },
          { period: '2016 ~ 2019', title: '스튜디오 세션 보컬', detail: '가이드 보컬, 코러스 녹음 참여', sortOrder: 2 },
        ],
      },
      works: {
        create: [
          { type: 'audio' as const, title: `${trainer.name.toUpperCase()} - Latest tracks`, subtitle: 'SoundCloud placeholder', sortOrder: 0 },
          { type: 'video' as const, title: `${trainer.name.toUpperCase()} - 2U (cover)`, subtitle: 'YouTube performance placeholder', sortOrder: 1 },
          { type: 'video' as const, title: 'Studio directing reel', subtitle: 'Featuring placeholder', sortOrder: 2 },
        ],
      },
      media: {
        create: [
          { type: 'photo' as const, title: '레슨룸', url: `${trainer.id}/lesson-room`, sortOrder: 0 },
          { type: 'photo' as const, title: '녹음 부스', url: `${trainer.id}/recording-room`, sortOrder: 1 },
          { type: 'video' as const, title: '발성 데모', url: `${trainer.id}/voice-demo`, sortOrder: 2 },
          { type: 'video' as const, title: '커버 영상', url: `${trainer.id}/cover-video`, sortOrder: 3 },
        ],
      },
      reviews: {
        create: Array.from({ length: 3 }, (_, reviewIndex) => ({
          id: `${trainer.id}-review-${reviewIndex + 1}`,
          displayName: '이**',
          regionLabel: trainer.districtLabel,
          body: '기초부터 차근차근 알려주셔서 고음이 정말 편해졌습니다. 발성에 도움이 많이 돼요.',
          likesCount: 21 - reviewIndex,
          dislikesCount: reviewIndex,
          createdAt: new Date(`2026-06-${20 - reviewIndex}T09:00:00+09:00`),
        })),
      },
    };

    await prisma.trainerProfile.upsert({
      where: { id: trainer.id },
      create: {
        id: trainer.id,
        ...scalarData,
        ...relationData,
      },
      update: {
        ...scalarData,
        ...relationData,
      },
    });
  }
}

async function main() {
  await seedReferenceData();
  await seedTrainers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
