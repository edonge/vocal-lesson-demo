import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type Role = 'student' | 'teacher' | null;

export type StudentData = {
  // 기본 정보
  name: string;
  gender: string | null;
  birthYear: string;
  // 온보딩 응답
  regions: string[];
  goals: string[];
  genres: string[];
  skillLevel: string | null;       // 현재 실력 자가진단
  mainProblem: string | null;      // 가장 해결하고 싶은 문제
  mainProblemDetail: string;       // (선택) 보충 설명
};

export type CurriculumStep = { title: string; desc: string };
export type FaqItem = { q: string; a: string };
export type PortfolioLink = { type: PortfolioType; label: string; url: string };
export type PortfolioType =
  | 'instagram'
  | 'youtube'
  | 'video'
  | 'audio'
  | 'space'
  | 'cover';
export type PriceVisibility = 'public' | 'consult';

export type TeacherData = {
  // 프로필 기본
  name: string;
  gender: string | null;
  photoUploaded: boolean;
  // 온보딩 응답
  regions: string[];
  targets: string[];
  specialties: string[];
  // 가격 (자세히)
  priceSingle: string;             // 1회
  pricePackage4: string;           // 4회 패키지
  pricePackage8: string;           // 8회 패키지 (선택)
  trialProvided: boolean | null;   // 체험 수업 제공 여부
  trialPrice: string;              // 체험 수업 가격
  lessonMinutes: string | null;    // 1회 수업 시간
  priceVisibility: PriceVisibility;
  // 소개
  bio: string;                     // 한 줄 소개
  aboutMe: string;                 // 자기소개 (긴 글)
  teachingPhilosophy: string;      // 수업 철학
  recommendedFor: string[];        // 이런 분께 추천
  curriculum: CurriculumStep[];    // 수업 커리큘럼
  lessonMethods: string[];         // 수업 방식 칩
  portfolioLinks: PortfolioLink[]; // 포트폴리오
  notices: string[];               // 수업 공지/안내사항
  faqs: FaqItem[];                 // 자주 묻는 질문
};

type State = {
  role: Role;
  student: StudentData;
  teacher: TeacherData;
};

type Ctx = State & {
  setRole: (r: Role) => void;
  updateStudent: (patch: Partial<StudentData>) => void;
  updateTeacher: (patch: Partial<TeacherData>) => void;
  toggleStudentField: (field: keyof StudentData, value: string) => void;
  toggleTeacherField: (field: keyof TeacherData, value: string) => void;
  reset: () => void;
};

const initialStudent: StudentData = {
  name: '',
  gender: null,
  birthYear: '',
  regions: [],
  goals: [],
  genres: [],
  skillLevel: null,
  mainProblem: null,
  mainProblemDetail: '',
};

const initialTeacher: TeacherData = {
  name: '',
  gender: null,
  photoUploaded: false,
  regions: [],
  targets: [],
  specialties: [],
  priceSingle: '',
  pricePackage4: '',
  pricePackage8: '',
  trialProvided: null,
  trialPrice: '',
  lessonMinutes: null,
  priceVisibility: 'public',
  bio: '',
  aboutMe: '',
  teachingPhilosophy: '',
  recommendedFor: [],
  curriculum: [],
  lessonMethods: [],
  portfolioLinks: [],
  notices: [],
  faqs: [],
};

const initialState: State = {
  role: null,
  student: initialStudent,
  teacher: initialTeacher,
};

const STORAGE_KEY = 'voccal:onboarding:v3';

const OnboardingContext = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => {
    if (typeof window === 'undefined') return initialState;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialState;
      const parsed = JSON.parse(raw);
      return {
        ...initialState,
        ...parsed,
        student: { ...initialStudent, ...(parsed.student ?? {}) },
        teacher: { ...initialTeacher, ...(parsed.teacher ?? {}) },
      };
    } catch {
      return initialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const value = useMemo<Ctx>(() => ({
    ...state,
    setRole: (role) => setState((s) => ({ ...s, role })),
    updateStudent: (patch) =>
      setState((s) => ({ ...s, student: { ...s.student, ...patch } })),
    updateTeacher: (patch) =>
      setState((s) => ({ ...s, teacher: { ...s.teacher, ...patch } })),
    toggleStudentField: (field, value) =>
      setState((s) => {
        const cur = s.student[field];
        if (Array.isArray(cur)) {
          const exists = cur.includes(value);
          const next = exists ? cur.filter((v) => v !== value) : [...cur, value];
          return { ...s, student: { ...s.student, [field]: next } };
        }
        return s;
      }),
    toggleTeacherField: (field, value) =>
      setState((s) => {
        const cur = s.teacher[field];
        if (Array.isArray(cur) && cur.every((v) => typeof v === 'string')) {
          const arr = cur as string[];
          const exists = arr.includes(value);
          const next = exists ? arr.filter((v) => v !== value) : [...arr, value];
          return { ...s, teacher: { ...s.teacher, [field]: next } };
        }
        return s;
      }),
    reset: () => setState(initialState),
  }), [state]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return ctx;
}
