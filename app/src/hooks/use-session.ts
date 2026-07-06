'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { fetchSession } from '@/lib/api/auth-client';
import type { ApiAuthUser } from '@/types/api';

/**
 * 세션 상태를 앱 전체에서 하나의 소스로 공유.
 * - fetchSession 은 내부적으로 TTL 캐시 + in-flight dedupe.
 * - 여러 컴포넌트가 useSession() 을 동시에 마운트해도 실제 fetch 는 1회.
 * - StrictMode 개발 이중 마운트에도 안전.
 * - login/logout 후에는 auth-client 가 캐시를 정리하고 refreshSession() 을 호출.
 */

type State = {
  user: ApiAuthUser | null;
  isLoading: boolean;
};

let current: State = { user: null, isLoading: true };
const listeners = new Set<() => void>();
let loadPromise: Promise<void> | null = null;

function emit() {
  listeners.forEach((l) => l());
}

function set(next: State) {
  current = next;
  emit();
}

function ensureLoaded(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = fetchSession()
    .then((data) => {
      set({ user: data.user, isLoading: false });
    })
    .catch(() => {
      set({ user: null, isLoading: false });
    })
    .finally(() => {
      loadPromise = null;
    });
  return loadPromise;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return current;
}

const SSR_STATE: State = { user: null, isLoading: true };
function getServerSnapshot() {
  return SSR_STATE;
}

export function useSession() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    void ensureLoaded();
  }, []);
  return state;
}

/** 로그인/로그아웃 이후 세션 상태를 즉시 갱신. */
export function refreshSession() {
  loadPromise = fetchSession()
    .then((data) => set({ user: data.user, isLoading: false }))
    .catch(() => set({ user: null, isLoading: false }))
    .finally(() => {
      loadPromise = null;
    });
  return loadPromise;
}
