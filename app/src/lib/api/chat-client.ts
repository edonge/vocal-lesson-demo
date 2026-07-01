import type {
  ApiChatMessage,
  ApiChatRoomDetail,
  ApiChatRoomsListResponse,
  ApiCreateChatRoomResponse,
} from '@/types/api';
import { apiFetch } from './client';

export type ChatRoomsFilter = 'all' | 'unread';

export function fetchChatRooms(
  filter: ChatRoomsFilter = 'all',
  signal?: AbortSignal
): Promise<ApiChatRoomsListResponse> {
  const params = new URLSearchParams();
  if (filter === 'unread') params.set('filter', 'unread');
  return apiFetch<ApiChatRoomsListResponse>('/api/chat-rooms', {
    cache: 'no-store',
    searchParams: params,
    signal,
  });
}

export function fetchChatRoom(
  roomId: string,
  signal?: AbortSignal
): Promise<ApiChatRoomDetail> {
  return apiFetch<ApiChatRoomDetail>(
    `/api/chat-rooms/${encodeURIComponent(roomId)}`,
    { cache: 'no-store', signal }
  );
}

export function createChatRoom(args: {
  trainerId: string;
  firstMessage?: string;
}): Promise<ApiCreateChatRoomResponse> {
  return apiFetch<ApiCreateChatRoomResponse>('/api/chat-rooms', {
    method: 'POST',
    body: args,
  });
}

export function postChatMessage(args: {
  roomId: string;
  body: string;
}): Promise<ApiChatMessage> {
  return apiFetch<ApiChatMessage>(
    `/api/chat-rooms/${encodeURIComponent(args.roomId)}/messages`,
    { method: 'POST', body: { body: args.body } }
  );
}

export function markChatRoomRead(roomId: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(
    `/api/chat-rooms/${encodeURIComponent(roomId)}/read`,
    { method: 'PATCH' }
  );
}
