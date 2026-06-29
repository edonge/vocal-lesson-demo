export type ChatPreview = {
  id: string;
  name: string;
  meta: string;
  date: string;
  message: string;
  unreadCount: number;
  avatarColor: string;
};

export type ChatTrainerInfo = {
  name: string;
  meta: string;
  intro: string;
  tags: string[];
  career: string;
  reviews: number;
  avatarColor: string;
};

export type ChatMessage = {
  id: string;
  sender: 'trainer' | 'me';
  text: string;
  time: string;
  read?: boolean;
};

export const chatPreviews: ChatPreview[] = [
  {
    id: 'ego-20260623',
    name: 'ego',
    meta: '성동구 · Kpop',
    date: '2026.06.23.',
    message: '안녕하세요! 이번 주 토요일 언제 첫 상담 가능하실까요? ..',
    unreadCount: 1,
    avatarColor: '#002fff',
  },
  {
    id: 'ego-20260611',
    name: 'ego',
    meta: '성동구 · Kpop',
    date: '2026.06.11',
    message: '넵 그럼 그때 뵙겠습니다!',
    unreadCount: 0,
    avatarColor: '#002fff',
  },
];

export const chatTrainerInfo: ChatTrainerInfo = {
  name: 'ego',
  meta: '성동구 · Kpop',
  intro: '탄탄한 기본기와 섬세한 피드백으로 도와드려요',
  tags: ['취미', '발성', '고음'],
  career: '경력 10년',
  reviews: 28,
  avatarColor: '#002fff',
};

export const chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'trainer',
    text: '안녕하세요! 도레에서 보컬 레슨 문의 주셔서 감사합니다 😊\n첫 상담 도와드릴게요!',
    time: '10:12',
  },
  {
    id: 'msg-2',
    sender: 'me',
    text: '안녕하세요! 이번 주 토요일에 첫 상담 가능하실까요?',
    time: '10:14',
    read: true,
  },
  {
    id: 'msg-3',
    sender: 'trainer',
    text: '네 가능합니다! 몇 시가 좋으실까요?\n현재 11시, 2시, 4시 이후가 비어있어요.',
    time: '10:16',
  },
  {
    id: 'msg-4',
    sender: 'me',
    text: '그럼 오후 2시로 부탁드려요!',
    time: '10:17',
    read: true,
  },
  {
    id: 'msg-5',
    sender: 'trainer',
    text: '좋아요! 6/28(토) 오후 2시로 예약해둘게요.\n레벨이나 경험을 간단히 알려주실 수 있을까요?\n더 맞춤 상담을 도와드릴 수 있어요 😊',
    time: '10:19',
  },
  {
    id: 'msg-6',
    sender: 'me',
    text: '실용음악 입시 준비 중이고,\n발성은 기초 정도만 배웠어요!',
    time: '10:22',
    read: true,
  },
  {
    id: 'msg-7',
    sender: 'trainer',
    text: '감사합니다! 첫 상담은 성동구 연습실에서 진행될 예정인데 괜찮으실까요?',
    time: '10:24',
  },
  {
    id: 'msg-8',
    sender: 'me',
    text: '네, 성동구 괜찮습니다!',
    time: '10:25',
    read: true,
  },
];
