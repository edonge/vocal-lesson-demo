import type { ApiBookmarkResponse } from '@/types/api';
import { apiFetch } from './client';

export function addBookmark(trainerId: string): Promise<ApiBookmarkResponse> {
  return apiFetch<ApiBookmarkResponse>(
    `/api/trainers/${encodeURIComponent(trainerId)}/bookmark`,
    { method: 'POST' }
  );
}

export function removeBookmark(trainerId: string): Promise<ApiBookmarkResponse> {
  return apiFetch<ApiBookmarkResponse>(
    `/api/trainers/${encodeURIComponent(trainerId)}/bookmark`,
    { method: 'DELETE' }
  );
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
