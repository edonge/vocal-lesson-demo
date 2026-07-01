import type { ApiHomeResponse } from '@/types/api';
import { apiFetch, withAbort } from './client';

let inFlightHome: Promise<ApiHomeResponse> | null = null;

export function fetchHome(signal?: AbortSignal): Promise<ApiHomeResponse> {
  inFlightHome ??= apiFetch<ApiHomeResponse>('/api/home', {
    cache: 'no-store',
  }).finally(() => {
    inFlightHome = null;
  });
  return withAbort(inFlightHome, signal);
}
