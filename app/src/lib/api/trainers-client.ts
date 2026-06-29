import type { ApiTrainerDetail, ApiTrainerPreview } from '@/types/api';
import { apiFetch } from './client';

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
  return apiFetch<TrainerSearchResponse>('/api/trainers', {
    cache: 'no-store',
    searchParams: buildSearchParams(q),
    signal,
  });
}

export function fetchTrainer(
  id: string,
  signal?: AbortSignal
): Promise<ApiTrainerDetail> {
  return apiFetch<ApiTrainerDetail>(`/api/trainers/${encodeURIComponent(id)}`, {
    cache: 'no-store',
    signal,
  });
}
