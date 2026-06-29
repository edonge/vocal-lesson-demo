import { DORE_PICK_TRAINERS } from '@/data/home';

export type TrainerProfileDetail = {
  id: string;
  name: string;
  genres: string[];
  locationText: string;
  heroImage: string;
  headline: string[];
  careerLabel: string;
  recommendedFor: string[];
  lessonInfo: Array<{ label: string; value: string }>;
  facilities: Array<{
    label: '연습실' | '주차';
    value: '보유' | '미보유' | '가능' | '불가능';
    available: boolean;
  }>;
  tags: string[];
  lessonApproach: string;
  education: Array<{ school: string; major: string }>;
  careers: Array<{ period: string; title: string; detail: string }>;
  extraInfo: string;
  works: Array<{ type: 'audio' | 'video'; title: string; subtitle: string }>;
  mediaPhotos: string[];
  mediaVideos: string[];
  reviews: Array<{
    id: string;
    name: string;
    region: string;
    body: string;
    ago: string;
    likes: number;
    dislikes: number;
    createdAt: string;
  }>;
};

const heroImage =
  'https://www.figma.com/api/mcp/asset/2be20130-c8c8-49ec-b5a4-8b2e6108ccb9';

const baseProfile: Omit<TrainerProfileDetail, 'id' | 'name'> = {
  genres: ['R&B', 'Kpop'],
  locationText: '합정역 n번 출구에서 n분 거리',
  heroImage,
  headline: ['발성 교정을 기반으로', '편안한 수업을 제공합니다.'],
  careerLabel: '레슨 경력 12년+',
  recommendedFor: [
    'Kpop, 남자 R&B를 좋아하시는 분',
    '입시 · 오디션을 준비 중이신 분',
    '고음에서 자꾸 목이 쉬시는 분',
    '편안한 분위기의 레슨을 선호하시는 분',
  ],
  lessonInfo: [
    { label: '레슨 방식', value: '1:1 개인 레슨' },
    { label: '레슨 시간', value: '60분 (1회)' },
    { label: '주소', value: '서울특별시 마포구 서교동 480-1' },
    { label: '가격', value: '월 300,000원' },
  ],
  facilities: [
    { label: '연습실', value: '미보유', available: false },
    { label: '주차', value: '가능', available: true },
  ],
  tags: ['취미', '입시', '오디션', '발라드', 'Kpop', '남성 전문'],
  lessonApproach:
    'STEP 1. 보컬 진단 & 상담: 현재 노래 습관과 고민을 함께 확인하고, 수강생이 원하는 목표 곡과 수업 방향을 구체적으로 정합니다.\n\nSTEP 2. 기초 발성 & 호흡: 목을 조이지 않고 편안하게 소리 내는 법을 익히며, 호흡 지지와 공명 위치를 몸으로 이해할 수 있게 훈련합니다.\n\nSTEP 3. 맞춤형 테크닉 적용: 고음, 바이브레이션, 음정, 감정 표현처럼 개인별 약점을 수업 안에서 바로 교정합니다.\n\nSTEP 4. 곡 적용 & 실전 연습: 배운 내용을 실제 곡에 적용하고 녹음 피드백까지 진행해 혼자 연습할 때도 방향을 잃지 않게 돕습니다.',
  education: [{ school: '동아방송예술대학교 졸업', major: '실용음악 전공' }],
  careers: [
    { period: '2020 ~ 현재', title: '보컬 레슨 6년+', detail: '취미 및 오디션 수강생 120명 이상 지도' },
    { period: '2018 ~ 현재', title: '싱어송라이터 활동', detail: 'EP 발매 및 라이브 클럽 공연 다수' },
    { period: '2016 ~ 2019', title: '스튜디오 세션 보컬', detail: '가이드 보컬, 코러스 녹음 참여' },
  ],
  extraInfo:
    '레슨은 수강생의 목표와 일정에 맞춰 유연하게 구성합니다. 처음 배우는 분에게는 부담 없는 발성 루틴부터, 오디션이나 공연을 준비하는 분에게는 곡 해석과 무대 표현까지 함께 다룹니다. 수업 후에는 그날의 핵심 피드백과 개인 연습 방향을 정리해드립니다.',
  works: [
    { type: 'audio', title: 'E.GO - Latest tracks', subtitle: 'SoundCloud placeholder' },
    { type: 'video', title: 'EGO - 2U (cover)', subtitle: 'YouTube performance placeholder' },
    { type: 'video', title: 'EGO - Famous (cover)', subtitle: 'Live clip placeholder' },
    { type: 'audio', title: 'E.GO featuring session', subtitle: 'Production placeholder' },
    { type: 'video', title: 'Studio directing reel', subtitle: 'Featuring placeholder' },
  ],
  mediaPhotos: ['레슨룸', '녹음 부스', '라이브 현장', '프로필 촬영'],
  mediaVideos: ['발성 데모', '커버 영상', '수업 스케치', '공연 클립'],
  reviews: Array.from({ length: 6 }, (_, index) => ({
    id: `review-${index + 1}`,
    name: '이**',
    region: '마포구',
    body: '기초부터 차근차근 알려주셔서 고음이 정말 편해졌습니다. 발성에 도움이 많이 돼요.',
    ago: '1개월 전',
    likes: 21,
    dislikes: 3,
    createdAt: `2026-06-${20 - index}`,
  })),
};

export const TRAINER_PROFILES: TrainerProfileDetail[] = DORE_PICK_TRAINERS.map(
  (trainer, index) => ({
    ...baseProfile,
    id: trainer.id,
    name: trainer.name,
    genres: [trainer.genre, index % 2 === 0 ? 'R&B' : '발라드'],
    careerLabel: trainer.career.replace('경력', '레슨 경력') + '+',
    lessonInfo: [
      ...baseProfile.lessonInfo.slice(0, 3),
      { label: '가격', value: trainer.price.replace('₩ ', '').replace('/월', '원') },
    ],
    tags: Array.from(new Set([...trainer.tags, ...baseProfile.tags])).slice(0, 6),
  })
);

export function getTrainerProfile(id: string): TrainerProfileDetail {
  return TRAINER_PROFILES.find((profile) => profile.id === id) ?? TRAINER_PROFILES[0];
}
