import type { ApiTrainerDetail, ApiTrainerPreview } from '@/types/api';
import { apiFetch, withAbort } from './client';

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

const inFlightTrainerSearch = new Map<string, Promise<TrainerSearchResponse>>();
const inFlightTrainerDetail = new Map<string, Promise<ApiTrainerDetail>>();

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
  const searchParams = buildSearchParams(q);
  const key = searchParams.toString();
  const request =
    inFlightTrainerSearch.get(key) ??
    apiFetch<TrainerSearchResponse>('/api/trainers', {
      cache: 'no-store',
      searchParams,
    }).finally(() => {
      inFlightTrainerSearch.delete(key);
    });
  inFlightTrainerSearch.set(key, request);
  return withAbort(request, signal);
}

export function fetchTrainer(
  id: string,
  signal?: AbortSignal
): Promise<ApiTrainerDetail> {
  const key = encodeURIComponent(id);
  const request =
    inFlightTrainerDetail.get(key) ??
    apiFetch<ApiTrainerDetail>(`/api/trainers/${key}`, {
      cache: 'no-store',
    }).finally(() => {
      inFlightTrainerDetail.delete(key);
    });
  inFlightTrainerDetail.set(key, request);
  return withAbort(request, signal);
}

export function prefetchTrainer(id: string): void {
  const key = encodeURIComponent(id);
  if (inFlightTrainerDetail.has(key)) return;
  const request = apiFetch<ApiTrainerDetail>(`/api/trainers/${key}`, {
    cache: 'no-store',
  }).finally(() => {
    inFlightTrainerDetail.delete(key);
  });
  inFlightTrainerDetail.set(key, request);
}
