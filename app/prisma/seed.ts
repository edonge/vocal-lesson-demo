import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth/password';

const prisma = new PrismaClient();
const DEV_USER_ID = 'dev-student';
const DEV_LOGIN_ID = 'devstudent';
const DEV_PASSWORD = 'password1234';

const trainerImage =
  'https://www.figma.com/api/mcp/asset/5a3eefe1-4408-4be7-8622-866af9258907';
const heroImage =
  'https://www.figma.com/api/mcp/asset/2be20130-c8c8-49ec-b5a4-8b2e6108ccb9';

const genres = ['발라드', 'R&B', '락/밴드', '팝송', '인디', 'KPOP/아이돌', '뮤지컬'];
const goals = ['입시', '취미', '축가/행사', '오디션', '녹음/커버'];
const facilities = ['연습실', '작업실', '레코딩룸', '주차공간'];
const tags = [
  '취미',
  '입시',
  '오디션',
  '발라드',
  'Kpop',
  '남성 전문',
  '발성',
  '고음',
  '호흡',
  '녹음',
  '톤',
  '무대',
  '입문',
];

const locationSeed = [
  { id: 'district-mapo', name: '마포구', neighborhoods: ['서교동', '합정동', '연남동'] },
  { id: 'district-seongdong', name: '성동구', neighborhoods: ['행당1동', '성수1가1동', '옥수동'] },
  { id: 'district-gangnam', name: '강남구', neighborhoods: ['신사동', '청담동', '역삼1동'] },
  { id: 'district-songpa', name: '송파구', neighborhoods: ['잠실본동', '방이2동', '석촌동'] },
  { id: 'district-seocho', name: '서초구', neighborhoods: ['서초1동', '방배본동', '반포4동'] },
  { id: 'district-yongsan', name: '용산구', neighborhoods: ['한남동', '이태원1동', '청파동'] },
  { id: 'district-gangseo', name: '강서구', neighborhoods: ['화곡1동', '발산1동', '등촌1동'] },
];

const trainerSeed = [
  {
    id: 'trainer-1',
    name: 'ego',
    districtId: 'district-mapo',
    neighborhoodId: 'district-mapo-hapjeong',
    genreNames: ['KPOP/아이돌', 'R&B'],
    goalNames: ['취미', '입시', '오디션'],
    tagNames: ['취미', '발성', '고음', 'Kpop', '입시', '오디션'],
    headline: '발성 교정을 기반으로\n편안한 수업을 제공합니다.',
    intro: '탄탄한 기본기와 섬세한 피드백으로 목소리의 가능성을 끌어올립니다.',
    careerYears: 10,
    priceMonthly: 350000,
    reviewCount: 128,
    districtLabel: '마포구',
  },
  {
    id: 'trainer-2',
    name: 'lia',
    districtId: 'district-seongdong',
    neighborhoodId: 'district-seongdong-haengdang1',
    genreNames: ['R&B', '발라드'],
    goalNames: ['입시', '취미'],
    tagNames: ['입시', '호흡', 'R&B', '발라드'],
    headline: '입시곡의 완성도를\n단단하게 올려드립니다.',
    intro: '호흡과 공명을 차분히 잡아 입시곡의 완성도를 높여드립니다.',
    careerYears: 8,
    priceMonthly: 320000,
    reviewCount: 94,
    districtLabel: '성동구',
  },
  {
    id: 'trainer-3',
    name: 'muse',
    districtId: 'district-gangnam',
    neighborhoodId: 'district-gangnam-sinsa',
    genreNames: ['발라드', '팝송'],
    goalNames: ['취미', '녹음/커버'],
    tagNames: ['발라드', '표현', '취미'],
    headline: '가사 해석부터\n프레이징까지 함께합니다.',
    intro: '가사 해석부터 프레이징까지 노래의 설득력을 함께 만듭니다.',
    careerYears: 7,
    priceMonthly: 300000,
    reviewCount: 73,
    districtLabel: '강남구',
  },
  {
    id: 'trainer-4',
    name: 'june',
    districtId: 'district-mapo',
    neighborhoodId: 'district-mapo-seogyo',
    genreNames: ['팝송', '인디'],
    goalNames: ['녹음/커버', '취미'],
    tagNames: ['팝송', '녹음', '톤'],
    headline: '녹음과 라이브 모두\n안정적인 톤을 만듭니다.',
    intro: '녹음과 라이브 모두에서 안정적인 톤을 낼 수 있도록 돕습니다.',
    careerYears: 9,
    priceMonthly: 340000,
    reviewCount: 116,
    districtLabel: '마포구',
  },
  {
    id: 'trainer-5',
    name: 'noah',
    districtId: 'district-songpa',
    neighborhoodId: 'district-songpa-jamsil',
    genreNames: ['뮤지컬', '발라드'],
    goalNames: ['취미', '오디션'],
    tagNames: ['뮤지컬', '발성', '무대'],
    headline: '무대에서 버티는\n단단한 발성을 훈련합니다.',
    intro: '대사와 노래가 자연스럽게 이어지는 무대형 발성을 훈련합니다.',
    careerYears: 11,
    priceMonthly: 380000,
    reviewCount: 151,
    districtLabel: '송파구',
  },
  {
    id: 'trainer-6',
    name: 'arin',
    districtId: 'district-seocho',
    neighborhoodId: 'district-seocho-seocho1',
    genreNames: ['KPOP/아이돌', '팝송'],
    goalNames: ['오디션', '입시'],
    tagNames: ['오디션', 'Kpop', '고음'],
    headline: '오디션에서 강점이 보이는\n곡 완성을 돕습니다.',
    intro: '짧은 시간 안에 강점이 드러나는 오디션 곡 완성도를 높입니다.',
    careerYears: 6,
    priceMonthly: 290000,
    reviewCount: 67,
    districtLabel: '서초구',
  },
  {
    id: 'trainer-7',
    name: 'rio',
    districtId: 'district-mapo',
    neighborhoodId: 'district-mapo-hapjeong',
    genreNames: ['인디', 'R&B'],
    goalNames: ['녹음/커버', '취미'],
    tagNames: ['인디', '녹음', '톤'],
    headline: '자작곡 분위기를 살리는\n보컬 톤을 찾습니다.',
    intro: '자작곡의 분위기를 살리는 보컬 톤과 녹음 디렉팅을 제공합니다.',
    careerYears: 10,
    priceMonthly: 360000,
    reviewCount: 132,
    districtLabel: '마포구',
  },
  {
    id: 'trainer-8',
    name: 'sian',
    districtId: 'district-yongsan',
    neighborhoodId: 'district-yongsan-hannam',
    genreNames: ['락/밴드', '팝송'],
    goalNames: ['취미', '오디션'],
    tagNames: ['락/밴드', '무대', '호흡'],
    headline: '강한 사운드 속에서도\n묻히지 않는 소리를 만듭니다.',
    intro: '강한 사운드 속에서도 묻히지 않는 발성과 체력을 함께 만듭니다.',
    careerYears: 12,
    priceMonthly: 370000,
    reviewCount: 108,
    districtLabel: '용산구',
  },
  {
    id: 'trainer-9',
    name: 'dawn',
    districtId: 'district-gangseo',
    neighborhoodId: 'district-gangseo-hwagok1',
    genreNames: ['발라드', 'KPOP/아이돌'],
    goalNames: ['취미'],
    tagNames: ['입문', '취미', '발성'],
    headline: '처음 시작하는 분도\n부담 없이 따라올 수 있어요.',
    intro: '처음 시작하는 분도 부담 없이 따라올 수 있게 단계별로 안내합니다.',
    careerYears: 5,
    priceMonthly: 250000,
    reviewCount: 58,
    districtLabel: '강서구',
  },
];

function neighborhoodId(districtId: string, name: string) {
  const slugMap: Record<string, string> = {
    합정동: 'hapjeong',
    서교동: 'seogyo',
    연남동: 'yeonnam',
    행당1동: 'haengdang1',
    성수1가1동: 'seongsu1',
    옥수동: 'oksu',
    신사동: 'sinsa',
    청담동: 'cheongdam',
    역삼1동: 'yeoksam1',
    잠실본동: 'jamsil',
    방이2동: 'bangi2',
    석촌동: 'seokchon',
    서초1동: 'seocho1',
    방배본동: 'bangbae',
    반포4동: 'banpo4',
    한남동: 'hannam',
    이태원1동: 'itaewon1',
    청파동: 'cheongpa',
    화곡1동: 'hwagok1',
    발산1동: 'balsan1',
    등촌1동: 'deungchon1',
  };
  return `${districtId}-${slugMap[name] ?? name}`;
}

async function clear() {
  await prisma.userSession.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.reviewReaction.deleteMany();
  await prisma.review.deleteMany();
  await prisma.trainerMedia.deleteMany();
  await prisma.trainerWork.deleteMany();
  await prisma.trainerCareer.deleteMany();
  await prisma.trainerEducation.deleteMany();
  await prisma.trainerRecommendedFor.deleteMany();
  await prisma.trainerFacility.deleteMany();
  await prisma.trainerTag.deleteMany();
  await prisma.trainerGoal.deleteMany();
  await prisma.trainerGenre.deleteMany();
  await prisma.studentGenre.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.userDailyDismissal.deleteMany();
  await prisma.user.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.neighborhood.deleteMany();
  await prisma.district.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.lessonGoal.deleteMany();
  await prisma.genre.deleteMany();
}

async function main() {
  await clear();

  await prisma.user.create({
    data: {
      id: DEV_USER_ID,
      role: 'student',
      loginId: DEV_LOGIN_ID,
      passwordHash: await hashPassword(DEV_PASSWORD),
      name: '이현동',
      phone: '01000000000',
      studentProfile: {
        create: {
          gender: 'male',
          birthYear: 2001,
          skillLevel: 'beginner',
          profileCompletionScore: 45,
        },
      },
    },
  });

  await prisma.genre.createMany({
    data: genres.map((name, index) => ({ id: `genre-${index + 1}`, name, sortOrder: index })),
  });
  await prisma.lessonGoal.createMany({
    data: goals.map((name, index) => ({ id: `goal-${index + 1}`, name, sortOrder: index })),
  });
  await prisma.facility.createMany({
    data: facilities.map((name, index) => ({ id: `facility-${index + 1}`, name, sortOrder: index })),
  });
  await prisma.tag.createMany({
    data: tags.map((name, index) => ({ id: `tag-${index + 1}`, name })),
  });

  for (const district of locationSeed) {
    await prisma.district.create({
      data: {
        id: district.id,
        name: district.name,
        neighborhoods: {
          create: district.neighborhoods.map((name) => ({
            id: neighborhoodId(district.id, name),
            name,
          })),
        },
      },
    });
  }

  await prisma.banner.createMany({
    data: [
      { id: 'banner-1', title: 'Dore 신규 추천', bgColor: '#035ef3', sortOrder: 1 },
      { id: 'banner-2', title: '내 지역 인기 트레이너', bgColor: '#7aafff', sortOrder: 2 },
      { id: 'banner-3', title: '첫 상담 가이드', bgColor: '#111827', sortOrder: 3 },
      { id: 'banner-4', title: '발성 집중 레슨', bgColor: '#48d597', sortOrder: 4 },
      { id: 'banner-5', title: '이번 주 오픈 클래스', bgColor: '#f97316', sortOrder: 5 },
    ],
  });

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
    await prisma.trainerProfile.create({
      data: {
        id: trainer.id,
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
        priceVisibility: 'public',
        hasPracticeRoom: index % 3 !== 0,
        hasParking: index % 2 === 0,
        lessonApproach:
          'STEP 1. 보컬 진단 & 상담: 현재 노래 습관과 고민을 함께 확인합니다.\n\nSTEP 2. 기초 발성 & 호흡: 목을 조이지 않고 편안하게 소리 내는 법을 익힙니다.\n\nSTEP 3. 맞춤형 테크닉 적용: 고음, 음정, 감정 표현처럼 개인별 약점을 수업 안에서 바로 교정합니다.\n\nSTEP 4. 곡 적용 & 실전 연습: 배운 내용을 실제 곡에 적용하고 녹음 피드백까지 진행합니다.',
        extraInfo:
          '레슨은 수강생의 목표와 일정에 맞춰 유연하게 구성합니다. 수업 후에는 그날의 핵심 피드백과 개인 연습 방향을 정리해드립니다.',
        reviewCount: trainer.reviewCount,
        isPublished: true,
        sortOrder: index,
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
            { type: 'audio', title: `${trainer.name.toUpperCase()} - Latest tracks`, subtitle: 'SoundCloud placeholder', sortOrder: 0 },
            { type: 'video', title: `${trainer.name.toUpperCase()} - 2U (cover)`, subtitle: 'YouTube performance placeholder', sortOrder: 1 },
            { type: 'video', title: 'Studio directing reel', subtitle: 'Featuring placeholder', sortOrder: 2 },
          ],
        },
        media: {
          create: [
            { type: 'photo', title: '레슨룸', url: `${trainer.id}/lesson-room`, sortOrder: 0 },
            { type: 'photo', title: '녹음 부스', url: `${trainer.id}/recording-room`, sortOrder: 1 },
            { type: 'video', title: '발성 데모', url: `${trainer.id}/voice-demo`, sortOrder: 2 },
            { type: 'video', title: '커버 영상', url: `${trainer.id}/cover-video`, sortOrder: 3 },
          ],
        },
        reviews: {
          create: Array.from({ length: 3 }, (_, reviewIndex) => ({
            id: `${trainer.id}-review-${reviewIndex + 1}`,
            studentId: DEV_USER_ID,
            displayName: '이**',
            regionLabel: trainer.districtLabel,
            body: '기초부터 차근차근 알려주셔서 고음이 정말 편해졌습니다. 발성에 도움이 많이 돼요.',
            likesCount: 21 - reviewIndex,
            dislikesCount: reviewIndex,
            createdAt: new Date(`2026-06-${20 - reviewIndex}T09:00:00+09:00`),
          })),
        },
      },
    });
  }

  await prisma.bookmark.create({
    data: { userId: DEV_USER_ID, trainerId: 'trainer-1' },
  });

  await prisma.chatRoom.create({
    data: {
      id: 'ego-20260623',
      studentId: DEV_USER_ID,
      trainerId: 'trainer-1',
      status: 'active',
      lastMessage: '네, 성동구 괜찮습니다!',
      lastMessageAt: new Date('2026-06-23T10:25:00+09:00'),
      studentUnreadCount: 1,
      trainerUnreadCount: 0,
      messages: {
        create: [
          {
            id: 'msg-1',
            senderRole: 'trainer',
            body: '안녕하세요! 도레에서 보컬 레슨 문의 주셔서 감사합니다 😊\n첫 상담 도와드릴게요!',
            createdAt: new Date('2026-06-23T10:12:00+09:00'),
          },
          {
            id: 'msg-2',
            senderUserId: DEV_USER_ID,
            senderRole: 'student',
            body: '안녕하세요! 이번 주 토요일에 첫 상담 가능하실까요?',
            readAt: new Date('2026-06-23T10:15:00+09:00'),
            createdAt: new Date('2026-06-23T10:14:00+09:00'),
          },
          {
            id: 'msg-3',
            senderRole: 'trainer',
            body: '네 가능합니다! 몇 시가 좋으실까요?\n현재 11시, 2시, 4시 이후가 비어있어요.',
            createdAt: new Date('2026-06-23T10:16:00+09:00'),
          },
          {
            id: 'msg-4',
            senderUserId: DEV_USER_ID,
            senderRole: 'student',
            body: '그럼 오후 2시로 부탁드려요!',
            readAt: new Date('2026-06-23T10:18:00+09:00'),
            createdAt: new Date('2026-06-23T10:17:00+09:00'),
          },
          {
            id: 'msg-5',
            senderRole: 'trainer',
            body: '좋아요! 6/28(토) 오후 2시로 예약해둘게요.\n레벨이나 경험을 간단히 알려주실 수 있을까요?',
            createdAt: new Date('2026-06-23T10:19:00+09:00'),
          },
          {
            id: 'msg-6',
            senderUserId: DEV_USER_ID,
            senderRole: 'student',
            body: '실용음악 입시 준비 중이고,\n발성은 기초 정도만 배웠어요!',
            readAt: new Date('2026-06-23T10:23:00+09:00'),
            createdAt: new Date('2026-06-23T10:22:00+09:00'),
          },
          {
            id: 'msg-7',
            senderRole: 'trainer',
            body: '감사합니다! 첫 상담은 성동구 연습실에서 진행될 예정인데 괜찮으실까요?',
            createdAt: new Date('2026-06-23T10:24:00+09:00'),
          },
          {
            id: 'msg-8',
            senderUserId: DEV_USER_ID,
            senderRole: 'student',
            body: '네, 성동구 괜찮습니다!',
            readAt: new Date('2026-06-23T10:26:00+09:00'),
            createdAt: new Date('2026-06-23T10:25:00+09:00'),
          },
        ],
      },
    },
  });

  await prisma.chatRoom.create({
    data: {
      id: 'lia-20260611',
      studentId: DEV_USER_ID,
      trainerId: 'trainer-2',
      status: 'closed',
      lastMessage: '넵 그럼 그때 뵙겠습니다!',
      lastMessageAt: new Date('2026-06-11T18:10:00+09:00'),
      messages: {
        create: [
          {
            id: 'msg-old-1',
            senderRole: 'trainer',
            body: '넵 그럼 그때 뵙겠습니다!',
            readAt: new Date('2026-06-11T18:11:00+09:00'),
            createdAt: new Date('2026-06-11T18:10:00+09:00'),
          },
        ],
      },
    },
  });
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
