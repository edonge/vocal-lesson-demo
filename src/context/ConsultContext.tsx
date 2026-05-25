import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

export type ConsultStatus =
  | 'new'
  | 'active'
  | 'trialProposed'
  | 'reservationPending'
  | 'reserved'
  | 'closed';

export const STATUS_LABEL: Record<ConsultStatus, string> = {
  new: '신규 문의',
  active: '상담 중',
  trialProposed: '체험 수업 제안',
  reservationPending: '예약 대기',
  reserved: '예약 완료',
  closed: '종료',
};

export const STATUS_TONE: Record<ConsultStatus, 'blue' | 'green' | 'amber' | 'gray'> = {
  new: 'blue',
  active: 'amber',
  trialProposed: 'amber',
  reservationPending: 'amber',
  reserved: 'green',
  closed: 'gray',
};

export type ChatMessage = {
  id: string;
  sender: 'student' | 'teacher';
  text: string;
  time: string;
};

export type StudentSummary = {
  name: string;
  goals: string[];
  mainProblem: string | null;
  mainProblemDetail?: string;
  genres: string[];
  regions: string[];
  skillLevel: string | null;
  budget?: string | null;
  preferredStyle?: string[];
};

export type Consultation = {
  id: string;
  trainerId: string;
  trainerName: string;
  studentId: string;
  studentName: string;
  studentInitial: string;
  studentColor: string;
  status: ConsultStatus;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  unread: { student: number; teacher: number };
  studentSummary: StudentSummary;
  messages: ChatMessage[];
};

const STORAGE_KEY = 'voccal:consults:v1';

function nowIso() {
  return new Date().toISOString();
}
function offsetIso(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}
function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

// ---- Seed: 강사 인박스가 처음부터 비어있지 않도록 ----
const SEED: Consultation[] = [
  {
    id: 'seed_1',
    trainerId: 'me',
    trainerName: '나',
    studentId: 'kim',
    studentName: '김민지',
    studentInitial: '김',
    studentColor: '#0b67ff',
    status: 'new',
    createdAt: offsetIso(15),
    updatedAt: offsetIso(15),
    lastMessage: '고음이 잘 안 올라가서 상담 받고 싶어요.',
    unread: { student: 0, teacher: 1 },
    studentSummary: {
      name: '김민지',
      goals: ['취미', '노래방 실력 향상'],
      mainProblem: '고음이 안 올라가요',
      mainProblemDetail: '노래방에서 2옥타브 라 위로는 거의 안 나와요.',
      genres: ['발라드', 'K-pop'],
      regions: ['홍대'],
      skillLevel: '초급',
      budget: '5~7만 원',
      preferredStyle: ['친절한 설명', '편안한 분위기'],
    },
    messages: [
      {
        id: uid('m'),
        sender: 'student',
        text: '안녕하세요. 고음이 잘 안 올라가서 상담 받고 싶어요. 취미로 배우고 싶고, 홍대 근처 수업을 찾고 있습니다.',
        time: offsetIso(15),
      },
    ],
  },
  {
    id: 'seed_2',
    trainerId: 'me',
    trainerName: '나',
    studentId: 'park',
    studentName: '박서준',
    studentInitial: '박',
    studentColor: '#14b8a6',
    status: 'new',
    createdAt: offsetIso(120),
    updatedAt: offsetIso(120),
    lastMessage: '취미 보컬 레슨 가능한가요?',
    unread: { student: 0, teacher: 1 },
    studentSummary: {
      name: '박서준',
      goals: ['취미'],
      mainProblem: '뭘 고쳐야 할지 모르겠어요',
      genres: ['아직 잘 모르겠음'],
      regions: ['홍대', '합정'],
      skillLevel: '입문',
      budget: '3~5만 원',
      preferredStyle: ['친절한 설명', '체계적인 커리큘럼'],
    },
    messages: [
      {
        id: uid('m'),
        sender: 'student',
        text: '안녕하세요. 취미 보컬 레슨 가능한가요? 노래방 점수 좀 올리고 싶어서요.',
        time: offsetIso(120),
      },
    ],
  },
  {
    id: 'seed_3',
    trainerId: 'me',
    trainerName: '나',
    studentId: 'lee',
    studentName: '이지원',
    studentInitial: '이',
    studentColor: '#7c3aed',
    status: 'active',
    createdAt: offsetIso(60 * 24),
    updatedAt: offsetIso(60 * 6),
    lastMessage: '평일 저녁 7시 이후도 가능하실까요?',
    unread: { student: 0, teacher: 1 },
    studentSummary: {
      name: '이지원',
      goals: ['입시'],
      mainProblem: '음정이 불안해요',
      genres: ['발라드', 'R&B'],
      regions: ['강남'],
      skillLevel: '중급',
      budget: '가격보다 강사 퀄리티가 중요함',
      preferredStyle: ['체계적인 커리큘럼', '정확한 피드백'],
    },
    messages: [
      {
        id: uid('m'),
        sender: 'student',
        text: '안녕하세요. 실용음악과 입시 준비 중인데 음정이 자꾸 흔들려서 상담 받고 싶어요.',
        time: offsetIso(60 * 24),
      },
      {
        id: uid('m'),
        sender: 'teacher',
        text: '안녕하세요 이지원님. 시창 청음과 함께 음정 안정화 훈련을 같이 진행합니다. 입시까지 얼마나 남으셨을까요?',
        time: offsetIso(60 * 22),
      },
      {
        id: uid('m'),
        sender: 'student',
        text: '5개월 남았어요. 평일 저녁 7시 이후도 가능하실까요?',
        time: offsetIso(60 * 6),
      },
    ],
  },
  {
    id: 'seed_4',
    trainerId: 'me',
    trainerName: '나',
    studentId: 'choi',
    studentName: '최우진',
    studentInitial: '최',
    studentColor: '#f97316',
    status: 'reservationPending',
    createdAt: offsetIso(60 * 24 * 3),
    updatedAt: offsetIso(60 * 24 * 1),
    lastMessage: '체험 수업 토요일 오후 3시로 가능할까요?',
    unread: { student: 1, teacher: 0 },
    studentSummary: {
      name: '최우진',
      goals: ['오디션'],
      mainProblem: '감정 표현이 어려워요',
      genres: ['R&B', '팝송'],
      regions: ['강남', '온라인'],
      skillLevel: '상급',
      budget: '5~7만 원',
      preferredStyle: ['정확한 피드백'],
    },
    messages: [
      {
        id: uid('m'),
        sender: 'student',
        text: '오디션 준비 중인데 곡 해석이 너무 단조롭다는 피드백을 받았어요.',
        time: offsetIso(60 * 24 * 3),
      },
      {
        id: uid('m'),
        sender: 'teacher',
        text: '가사 해석과 호흡 설계를 함께 다듬으면 좋아질 것 같아요. 체험 수업 한번 잡아볼까요?',
        time: offsetIso(60 * 24 * 2),
      },
      {
        id: uid('m'),
        sender: 'student',
        text: '체험 수업 토요일 오후 3시로 가능할까요?',
        time: offsetIso(60 * 24),
      },
    ],
  },
];

type Ctx = {
  consultations: Consultation[];
  getByTrainerForMe: (trainerId: string) => Consultation | undefined;
  getById: (id: string) => Consultation | undefined;
  startConsultation: (args: {
    trainerId: string;
    trainerName: string;
    firstMessage: string;
    studentName: string;
    studentSummary: StudentSummary;
  }) => string;
  sendMessage: (consultId: string, sender: 'student' | 'teacher', text: string) => void;
  setStatus: (consultId: string, status: ConsultStatus) => void;
  markRead: (consultId: string, role: 'student' | 'teacher') => void;
  reset: () => void;
};

const ConsultContext = createContext<Ctx | null>(null);

export function ConsultProvider({ children }: { children: ReactNode }) {
  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    if (typeof window === 'undefined') return SEED;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return SEED;
      return JSON.parse(raw) as Consultation[];
    } catch {
      return SEED;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
    } catch {}
  }, [consultations]);

  const value = useMemo<Ctx>(
    () => ({
      consultations,
      getById: (id) => consultations.find((c) => c.id === id),
      getByTrainerForMe: (trainerId) =>
        consultations.find((c) => c.trainerId === trainerId && c.studentId === 'me'),
      startConsultation: ({ trainerId, trainerName, firstMessage, studentName, studentSummary }) => {
        const existing = consultations.find(
          (c) => c.trainerId === trainerId && c.studentId === 'me'
        );
        if (existing) return existing.id;
        const initial = studentName?.[0] || '나';
        const id = uid('c');
        const t = nowIso();
        const message: ChatMessage = {
          id: uid('m'),
          sender: 'student',
          text: firstMessage,
          time: t,
        };
        const next: Consultation = {
          id,
          trainerId,
          trainerName,
          studentId: 'me',
          studentName: studentName || '회원',
          studentInitial: initial,
          studentColor: '#0b67ff',
          status: 'new',
          createdAt: t,
          updatedAt: t,
          lastMessage: firstMessage,
          unread: { student: 0, teacher: 1 },
          studentSummary,
          messages: [message],
        };
        setConsultations((prev) => [next, ...prev]);
        return id;
      },
      sendMessage: (consultId, sender, text) => {
        if (!text.trim()) return;
        setConsultations((prev) =>
          prev.map((c) =>
            c.id === consultId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    { id: uid('m'), sender, text, time: nowIso() },
                  ],
                  lastMessage: text,
                  updatedAt: nowIso(),
                  status: c.status === 'new' ? 'active' : c.status,
                  unread: {
                    student: sender === 'teacher' ? c.unread.student + 1 : c.unread.student,
                    teacher: sender === 'student' ? c.unread.teacher + 1 : c.unread.teacher,
                  },
                }
              : c
          )
        );
      },
      setStatus: (consultId, status) =>
        setConsultations((prev) =>
          prev.map((c) =>
            c.id === consultId ? { ...c, status, updatedAt: nowIso() } : c
          )
        ),
      markRead: (consultId, role) =>
        setConsultations((prev) =>
          prev.map((c) =>
            c.id === consultId
              ? { ...c, unread: { ...c.unread, [role]: 0 } }
              : c
          )
        ),
      reset: () => setConsultations(SEED),
    }),
    [consultations]
  );

  return <ConsultContext.Provider value={value}>{children}</ConsultContext.Provider>;
}

export function useConsult() {
  const ctx = useContext(ConsultContext);
  if (!ctx) throw new Error('useConsult must be used inside ConsultProvider');
  return ctx;
}

// ---- Helpers ----

export function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  return d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
}

export function formatClock(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
