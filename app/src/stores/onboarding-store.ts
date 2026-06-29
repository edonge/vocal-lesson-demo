import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, StudentProfile, TeacherProfile } from '@/types';

const initialStudent: StudentProfile = {
  name: '',
  gender: null,
  birthYear: '',
  regions: [],
  goals: [],
  genres: [],
  admissionMajor: '',
  eventYear: '',
  eventMonth: '',
  eventDay: '',
  eventSongName: '',
  auditionDirection: '',
  otherLessonDescription: '',
  skillLevel: null,
  mainProblems: [],
  mainProblemDetail: '',
};

const initialTeacher: TeacherProfile = {
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

type OnboardingState = {
  role: Role;
  student: StudentProfile;
  teacher: TeacherProfile;
  setRole: (role: Role) => void;
  updateStudent: (patch: Partial<StudentProfile>) => void;
  updateTeacher: (patch: Partial<TeacherProfile>) => void;
  toggleStudentArray: (key: keyof StudentProfile, value: string) => void;
  toggleTeacherArray: (key: keyof TeacherProfile, value: string) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      role: null,
      student: initialStudent,
      teacher: initialTeacher,

      setRole: (role) => set({ role }),

      updateStudent: (patch) =>
        set((s) => ({ student: { ...s.student, ...patch } })),

      updateTeacher: (patch) =>
        set((s) => ({ teacher: { ...s.teacher, ...patch } })),

      toggleStudentArray: (key, value) =>
        set((s) => {
          const cur = s.student[key];
          if (!Array.isArray(cur) || !cur.every((v) => typeof v === 'string')) return s;
          const arr = cur as string[];
          const next = arr.includes(value)
            ? arr.filter((v) => v !== value)
            : [...arr, value];
          return { student: { ...s.student, [key]: next } };
        }),

      toggleTeacherArray: (key, value) =>
        set((s) => {
          const cur = s.teacher[key];
          if (!Array.isArray(cur) || !cur.every((v) => typeof v === 'string')) return s;
          const arr = cur as string[];
          const next = arr.includes(value)
            ? arr.filter((v) => v !== value)
            : [...arr, value];
          return { teacher: { ...s.teacher, [key]: next } };
        }),

      reset: () =>
        set({ role: null, student: initialStudent, teacher: initialTeacher }),
    }),
    {
      name: 'voccal:onboarding:v1',
      version: 1,
    }
  )
);
