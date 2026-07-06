import type { ApiHomeResponse } from '@/types/api';
import { apiFetch } from './client';
import { cachedFetch } from './cache';

const HOME_KEY = 'GET /api/home';
const HOME_TTL_MS = 30_000;

export function fetchHome(signal?: AbortSignal): Promise<ApiHomeResponse> {
  return cachedFetch(
    HOME_KEY,
    HOME_TTL_MS,
    () => apiFetch<ApiHomeResponse>('/api/home', { cache: 'no-store' }),
    signal
  );
}
