import { TeacherData } from '../context/OnboardingContext';

export type CompletionItem = {
  key: string;
  label: string;
  done: boolean;
  /** anchor section id used in the edit screen */
  section: string;
  /** short marketing copy shown when item is undone */
  hook?: string;
};

export function computeTeacherCompletion(t: TeacherData): {
  percent: number;
  items: CompletionItem[];
  doneCount: number;
  totalCount: number;
} {
  const basicInfoDone =
    !!t.name && !!t.gender && t.photoUploaded && t.regions.length > 0 && !!t.bio;
  const priceDone =
    !!t.priceSingle && !!t.lessonMinutes && !!t.pricePackage4 && t.trialProvided !== null;

  const items: CompletionItem[] = [
    {
      key: 'basic',
      label: '기본 정보',
      done: basicInfoDone,
      section: 'basic',
      hook: '활동명·지역·한 줄 소개부터 채워보세요.',
    },
    {
      key: 'specialties',
      label: '전문 분야',
      done: t.specialties.length > 0,
      section: 'specialties',
      hook: '전문 분야 태그가 있으면 수강생 검색에 노출돼요.',
    },
    {
      key: 'price',
      label: '가격표',
      done: priceDone,
      section: 'price',
      hook: '가격이 공개된 프로필은 상담 전에 신뢰를 줄 수 있어요.',
    },
    {
      key: 'aboutMe',
      label: '자기소개',
      done: t.aboutMe.trim().length >= 30,
      section: 'aboutMe',
      hook: '수강생은 경력보다 “나와 잘 맞는지”를 봐요. 짧아도 진심을 담아 적어보세요.',
    },
    {
      key: 'philosophy',
      label: '수업 철학',
      done: t.teachingPhilosophy.trim().length >= 20,
      section: 'philosophy',
      hook: '수업 철학을 적은 강사는 단순 가격 비교에서 벗어날 수 있어요.',
    },
    {
      key: 'recommendedFor',
      label: '이런 분께 추천',
      done: t.recommendedFor.length > 0,
      section: 'recommendedFor',
      hook: '딱 맞는 수강생만 모이게 만드는 가장 효과적인 섹션이에요.',
    },
    {
      key: 'curriculum',
      label: '수업 커리큘럼',
      done: t.curriculum.length >= 2,
      section: 'curriculum',
      hook: '커리큘럼이 있으면 수강생이 수업 흐름을 미리 그려볼 수 있어요.',
    },
    {
      key: 'methods',
      label: '수업 방식',
      done: t.lessonMethods.length > 0,
      section: 'methods',
      hook: '1:1 / 녹음 피드백 / 온라인 가능 등 수업 방식을 알려주세요.',
    },
    {
      key: 'portfolio',
      label: '포트폴리오',
      done: t.portfolioLinks.length > 0,
      section: 'portfolio',
      hook: '포트폴리오를 추가하면 수강생이 수업 스타일을 더 쉽게 이해할 수 있어요.',
    },
    {
      key: 'notices',
      label: '수업 공지 / 안내사항',
      done: t.notices.length > 0,
      section: 'notices',
      hook: '미리 안내해두면 첫 수업이 훨씬 매끄러워져요.',
    },
    {
      key: 'faqs',
      label: '자주 묻는 질문',
      done: t.faqs.length > 0,
      section: 'faqs',
      hook: '자주 묻는 질문을 미리 채우면 상담 시간을 크게 줄일 수 있어요.',
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const totalCount = items.length;
  const percent = Math.round((doneCount / totalCount) * 100);
  return { percent, items, doneCount, totalCount };
}
