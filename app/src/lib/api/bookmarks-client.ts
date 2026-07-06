import type { ApiBookmarkResponse } from '@/types/api';
import { apiFetch } from './client';
import { invalidateCache } from './cache';

function invalidateAfterBookmark(trainerId: string) {
  invalidateCache(`GET /api/trainers/${trainerId}`);
  invalidateCache('GET /api/home');
  invalidateCache(/^GET \/api\/trainers\?/);
}

export async function addBookmark(trainerId: string): Promise<ApiBookmarkResponse> {
  const res = await apiFetch<ApiBookmarkResponse>(
    `/api/trainers/${encodeURIComponent(trainerId)}/bookmark`,
    { method: 'POST' }
  );
  invalidateAfterBookmark(trainerId);
  return res;
}

export async function removeBookmark(trainerId: string): Promise<ApiBookmarkResponse> {
  const res = await apiFetch<ApiBookmarkResponse>(
    `/api/trainers/${encodeURIComponent(trainerId)}/bookmark`,
    { method: 'DELETE' }
  );
  invalidateAfterBookmark(trainerId);
  return res;
}

/** 토글 헬퍼. 현재 상태에 따라 POST/DELETE 자동 분기. */
export function toggleBookmark(
  trainerId: string,
  currentlyBookmarked: boolean
): Promise<ApiBookmarkResponse> {
  return currentlyBookmarked
    ? removeBookmark(trainerId)
    : addBookmark(trainerId);
}
