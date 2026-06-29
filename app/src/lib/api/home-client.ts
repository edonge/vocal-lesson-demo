import type { ApiHomeResponse } from '@/types/api';
import { apiFetch } from './client';

export function fetchHome(signal?: AbortSignal): Promise<ApiHomeResponse> {
  return apiFetch<ApiHomeResponse>('/api/home', { cache: 'no-store', signal });
}
