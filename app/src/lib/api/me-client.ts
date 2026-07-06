import type {
  ApiMeResponse,
  UpdateStudentProfilePayload,
  UpdateStudentProfileResponse,
} from '@/types/api';
import { apiFetch } from './client';
import { cachedFetch, invalidateCache, setCache } from './cache';

export const ME_CACHE_KEY = 'GET /api/me';
const ME_TTL_MS = 30_000;

export function fetchMe(signal?: AbortSignal): Promise<ApiMeResponse> {
  return cachedFetch(
    ME_CACHE_KEY,
    ME_TTL_MS,
    () => apiFetch<ApiMeResponse>('/api/me', { cache: 'no-store' }),
    signal
  );
}

export async function updateStudentProfile(
  payload: UpdateStudentProfilePayload
): Promise<UpdateStudentProfileResponse> {
  const res = await apiFetch<UpdateStudentProfileResponse>(
    '/api/me/student-profile',
    { method: 'PATCH', body: payload }
  );
  // 서버 저장 성공 → me 캐시 무효화 + userDistrict 가 바뀔 수 있으니 home 도 무효화
  invalidateCache(ME_CACHE_KEY);
  invalidateCache('GET /api/home');
  return res;
}

/** 로그아웃 등에서 me 를 즉시 null 로 만들기. */
export function clearMeCache() {
  invalidateCache(ME_CACHE_KEY);
}

/** 서버 응답을 이미 갖고 있을 때 캐시에 넣기 (외부 mutation 후 즉시 반영). */
export function primeMeCache(data: ApiMeResponse) {
  setCache(ME_CACHE_KEY, data, ME_TTL_MS);
}
