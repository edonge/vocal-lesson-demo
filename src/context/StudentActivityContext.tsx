import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

type StudentActivityState = {
  favoriteTrainerIds: string[];
  recentTrainerIds: string[];
  compareTrainerIds: string[];
};

type Ctx = StudentActivityState & {
  toggleFavorite: (trainerId: string) => void;
  addRecentTrainer: (trainerId: string) => void;
  toggleCompareTrainer: (trainerId: string) => void;
  removeCompareTrainer: (trainerId: string) => void;
  clearCompare: () => void;
};

const STORAGE_KEY = 'voccal:student-activity:v1';
const MAX_RECENT = 8;
const MAX_COMPARE = 3;

const initialState: StudentActivityState = {
  favoriteTrainerIds: [],
  recentTrainerIds: [],
  compareTrainerIds: [],
};

const StudentActivityContext = createContext<Ctx | null>(null);

function uniqueIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((x): x is string => typeof x === 'string')));
}

export function StudentActivityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudentActivityState>(() => {
    if (typeof window === 'undefined') return initialState;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initialState;
      const parsed = JSON.parse(raw);
      return {
        favoriteTrainerIds: uniqueIds(parsed.favoriteTrainerIds),
        recentTrainerIds: uniqueIds(parsed.recentTrainerIds).slice(0, MAX_RECENT),
        compareTrainerIds: uniqueIds(parsed.compareTrainerIds).slice(0, MAX_COMPARE),
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

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      toggleFavorite: (trainerId) =>
        setState((prev) => {
          const exists = prev.favoriteTrainerIds.includes(trainerId);
          return {
            ...prev,
            favoriteTrainerIds: exists
              ? prev.favoriteTrainerIds.filter((id) => id !== trainerId)
              : [trainerId, ...prev.favoriteTrainerIds],
          };
        }),
      addRecentTrainer: (trainerId) =>
        setState((prev) => {
          if (prev.recentTrainerIds[0] === trainerId) return prev;
          return {
            ...prev,
            recentTrainerIds: [
              trainerId,
              ...prev.recentTrainerIds.filter((id) => id !== trainerId),
            ].slice(0, MAX_RECENT),
          };
        }),
      toggleCompareTrainer: (trainerId) =>
        setState((prev) => {
          const exists = prev.compareTrainerIds.includes(trainerId);
          if (exists) {
            return {
              ...prev,
              compareTrainerIds: prev.compareTrainerIds.filter((id) => id !== trainerId),
            };
          }
          if (prev.compareTrainerIds.length >= MAX_COMPARE) return prev;
          return { ...prev, compareTrainerIds: [...prev.compareTrainerIds, trainerId] };
        }),
      removeCompareTrainer: (trainerId) =>
        setState((prev) => ({
          ...prev,
          compareTrainerIds: prev.compareTrainerIds.filter((id) => id !== trainerId),
        })),
      clearCompare: () => setState((prev) => ({ ...prev, compareTrainerIds: [] })),
    }),
    [state]
  );

  return (
    <StudentActivityContext.Provider value={value}>
      {children}
    </StudentActivityContext.Provider>
  );
}

export function useStudentActivity() {
  const ctx = useContext(StudentActivityContext);
  if (!ctx) throw new Error('useStudentActivity must be used inside StudentActivityProvider');
  return ctx;
}
