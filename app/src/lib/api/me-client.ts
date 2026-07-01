import type {
  ApiMeResponse,
  UpdateStudentProfilePayload,
  UpdateStudentProfileResponse,
} from '@/types/api';
import { apiFetch } from './client';

export function fetchMe(signal?: AbortSignal): Promise<ApiMeResponse> {
  return apiFetch<ApiMeResponse>('/api/me', { cache: 'no-store', signal });
}

export function updateStudentProfile(
  payload: UpdateStudentProfilePayload
): Promise<UpdateStudentProfileResponse> {
  return apiFetch<UpdateStudentProfileResponse>('/api/me/student-profile', {
    method: 'PATCH',
    body: payload,
  });
}
