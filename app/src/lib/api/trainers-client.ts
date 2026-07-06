import type { ApiTrainerDetail, ApiTrainerPreview } from '@/types/api';
import { apiFetch } from './client';
import { cachedFetch } from './cache';

export type TrainerSortOption = 'recommended' | 'price' | 'reviews' | 'career';

export type TrainerSearchQuery = {
  district?: string;
  neighborhood?: string;
  genres?: string[];
  goals?: string[];
  facilities?: string[];
  priceMin?: number;
  priceMax?: number;
  careerMin?: number;
  careerMax?: number;
  sort?: TrainerSortOption;
};

export type TrainerSearchResponse = {
  total: number;
  items: ApiTrainerPreview[];
};

const TRAINERS_LIST_TTL_MS = 30_000;
const TRAINER_DETAIL_TTL_MS = 5 * 60_000;

/**
 * Filter state → URLSearchParams.
 * 한글 값은 URLSearchParams.set 이 자동으로 percent-encode 한다.
 */
function buildSearchParams(q: TrainerSearchQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (q.district) params.set('district', q.district);
  if (q.neighborhood) params.set('neighborhood', q.neighborhood);
  if (q.genres?.length) params.set('genres', q.genres.join(','));
  if (q.goals?.length) params.set('goals', q.goals.join(','));
  if (q.facilities?.length) params.set('facilities', q.facilities.join(','));
  if (typeof q.priceMin === 'number') params.set('priceMin', String(q.priceMin));
  if (typeof q.priceMax === 'number') params.set('priceMax', String(q.priceMax));
  if (typeof q.careerMin === 'number') params.set('careerMin', String(q.careerMin));
  if (typeof q.careerMax === 'number') params.set('careerMax', String(q.careerMax));
  if (q.sort) params.set('sort', q.sort);
  return params;
}

export function fetchTrainers(
  q: TrainerSearchQuery = {},
  signal?: AbortSignal
): Promise<TrainerSearchResponse> {
  const params = buildSearchParams(q);
  const key = `GET /api/trainers?${params.toString()}`;
  return cachedFetch(
    key,
    TRAINERS_LIST_TTL_MS,
    () =>
      apiFetch<TrainerSearchResponse>('/api/trainers', {
        cache: 'no-store',
        searchParams: params,
      }),
    signal
  );
}

export function fetchTrainer(
  id: string,
  signal?: AbortSignal
): Promise<ApiTrainerDetail> {
  const key = `GET /api/trainers/${id}`;
  return cachedFetch(
    key,
    TRAINER_DETAIL_TTL_MS,
    () =>
      apiFetch<ApiTrainerDetail>(`/api/trainers/${encodeURIComponent(id)}`, {
        cache: 'no-store',
      }),
    signal
  );
}

/**
 * 카드 hover/focus 시 상세 데이터를 백그라운드로 warming.
 * 결과를 기다리지 않고 에러도 삼킨다 — 캐시가 실패해도 실제 진입 시 재요청되면 그만.
 */
export function prefetchTrainer(id: string): void {
  fetchTrainer(id).catch(() => {});
}
