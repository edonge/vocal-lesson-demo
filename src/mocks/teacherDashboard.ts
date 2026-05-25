export type ChecklistItem = { label: string; done: boolean };
export type InquiryPreview = {
  id: string;
  name: string;
  initial: string;
  color: string;
  message: string;
  time: string;
  isNew: boolean;
};

export const TEACHER_DASHBOARD = {
  profileViews: 128,
  inquiries: 6,
  likes: 14,
  reviewsCount: 3,
  profileCompletion: 72,
  checklist: [
    { label: '프로필 사진 등록', done: true },
    { label: '기본 소개 작성', done: true },
    { label: '가격표 입력', done: true },
    { label: '포트폴리오 링크 등록', done: false },
    { label: '가능 시간대 입력', done: false },
  ] as ChecklistItem[],
  todoList: [
    '신규 문의에 답변하기',
    '포트폴리오 링크 추가하기',
    '가능 시간대 입력하기',
    '체험 수업 가격 설정하기',
  ],
  recentInquiries: [
    {
      id: 'q1',
      name: '김민지',
      initial: '김',
      color: '#0b67ff',
      message: '고음이 잘 안 올라가서 상담 받고 싶어요.',
      time: '15분 전',
      isNew: true,
    },
    {
      id: 'q2',
      name: '박서준',
      initial: '박',
      color: '#14b8a6',
      message: '취미 보컬 레슨 가능한가요?',
      time: '2시간 전',
      isNew: true,
    },
  ] as InquiryPreview[],
  currentPlan: '무료 베타',
  exposureStatus: '이번 달 기본 노출 중',
  exposureNote: '프로필 상단 노출 기능은 준비 중입니다',
};
