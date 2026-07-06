import type {
  ApiSessionResponse,
  AuthLoginPayload,
  AuthSignupPayload,
} from '@/types/api';
import { apiFetch } from './client';
import { cachedFetch, invalidateCache, setCache } from './cache';

export const SESSION_CACHE_KEY = 'GET /api/auth/session';
const SESSION_TTL_MS = 30_000;

export function checkLoginId(loginId: string) {
  return apiFetch<{ available: boolean }>('/api/auth/signup/check-login-id', {
    method: 'POST',
    body: { loginId },
  });
}

export async function signup(payload: AuthSignupPayload) {
  const res = await apiFetch<ApiSessionResponse>('/api/auth/signup', {
    method: 'POST',
    body: payload,
  });
  // 새 세션이 시작됨 → 이전 사용자 스코프 캐시 초기화 후 세션 캐시 프라임.
  invalidateCache('*');
  setCache(SESSION_CACHE_KEY, res, SESSION_TTL_MS);
  return res;
}

export async function login(payload: AuthLoginPayload) {
  const res = await apiFetch<ApiSessionResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
  invalidateCache('*');
  setCache(SESSION_CACHE_KEY, res, SESSION_TTL_MS);
  return res;
}

export async function logout() {
  const res = await apiFetch<{ ok: boolean }>('/api/auth/logout', {
    method: 'POST',
  });
  invalidateCache('*');
  return res;
}

export function fetchSession(signal?: AbortSignal) {
  return cachedFetch(
    SESSION_CACHE_KEY,
    SESSION_TTL_MS,
    () =>
      apiFetch<ApiSessionResponse>('/api/auth/session', { cache: 'no-store' }),
    signal
  );
}
