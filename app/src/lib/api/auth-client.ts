import type {
  ApiSessionResponse,
  AuthLoginPayload,
  AuthSignupPayload,
} from '@/types/api';
import { apiFetch } from './client';

export function checkLoginId(loginId: string) {
  return apiFetch<{ available: boolean }>('/api/auth/signup/check-login-id', {
    method: 'POST',
    body: { loginId },
  });
}

export function signup(payload: AuthSignupPayload) {
  return apiFetch<ApiSessionResponse>('/api/auth/signup', {
    method: 'POST',
    body: payload,
  });
}

export function login(payload: AuthLoginPayload) {
  return apiFetch<ApiSessionResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function logout() {
  return apiFetch<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
}

export function fetchSession(signal?: AbortSignal) {
  return apiFetch<ApiSessionResponse>('/api/auth/session', {
    cache: 'no-store',
    signal,
  });
}
