import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ConsultStatus, Consultation, StudentSummary } from '@/types';

const uid = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const now = () => new Date().toISOString();

type StartArgs = {
  trainerId: string;
  trainerName: string;
  firstMessage: string;
  studentName: string;
  studentSummary: StudentSummary;
};

type ConsultState = {
  consultations: Consultation[];
  getByTrainerForMe: (trainerId: string) => Consultation | undefined;
  getById: (id: string) => Consultation | undefined;
  start: (args: StartArgs) => string;
  sendMessage: (id: string, sender: 'student' | 'teacher', text: string) => void;
  setStatus: (id: string, status: ConsultStatus) => void;
  markRead: (id: string, role: 'student' | 'teacher') => void;
  hydrate: (seed: Consultation[]) => void;
  reset: () => void;
};

export const useConsultStore = create<ConsultState>()(
  persist(
    (set, get) => ({
      consultations: [],

      getByTrainerForMe: (trainerId) =>
        get().consultations.find(
          (c) => c.trainerId === trainerId && c.studentId === 'me'
        ),

      getById: (id) => get().consultations.find((c) => c.id === id),

      start: ({ trainerId, trainerName, firstMessage, studentName, studentSummary }) => {
        const existing = get().consultations.find(
          (c) => c.trainerId === trainerId && c.studentId === 'me'
        );
        if (existing) return existing.id;

        const id = uid('c');
        const t = now();
        const initial = studentName?.[0] ?? '나';
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
          messages: [{ id: uid('m'), sender: 'student', text: firstMessage, time: t }],
        };
        set((s) => ({ consultations: [next, ...s.consultations] }));
        return id;
      },

      sendMessage: (id, sender, text) => {
        if (!text.trim()) return;
        set((s) => ({
          consultations: s.consultations.map((c) =>
            c.id !== id
              ? c
              : {
                  ...c,
                  messages: [
                    ...c.messages,
                    { id: uid('m'), sender, text: text.trim(), time: now() },
                  ],
                  lastMessage: text.trim(),
                  updatedAt: now(),
                  status: c.status === 'new' ? 'active' : c.status,
                  unread: {
                    student:
                      sender === 'teacher' ? c.unread.student + 1 : c.unread.student,
                    teacher:
                      sender === 'student' ? c.unread.teacher + 1 : c.unread.teacher,
                  },
                }
          ),
        }));
      },

      setStatus: (id, status) =>
        set((s) => ({
          consultations: s.consultations.map((c) =>
            c.id === id ? { ...c, status, updatedAt: now() } : c
          ),
        })),

      markRead: (id, role) =>
        set((s) => ({
          consultations: s.consultations.map((c) =>
            c.id === id ? { ...c, unread: { ...c.unread, [role]: 0 } } : c
          ),
        })),

      hydrate: (seed) =>
        set((s) => ({
          consultations: s.consultations.length > 0 ? s.consultations : seed,
        })),

      reset: () => set({ consultations: [] }),
    }),
    {
      name: 'dore:consults:v1',
      version: 1,
    }
  )
);
