import type {
  ApiChatMessage,
  ApiChatRoomDetail,
  ApiChatRoomsListResponse,
  ApiCreateChatRoomResponse,
} from '@/types/api';
import { apiFetch } from './client';
import { cachedFetch, invalidateCache } from './cache';

export type ChatRoomsFilter = 'all' | 'unread';

const CHAT_ROOMS_TTL_MS = 10_000;
const CHAT_ROOM_TTL_MS = 5_000;

export function fetchChatRooms(
  filter: ChatRoomsFilter = 'all',
  signal?: AbortSignal
): Promise<ApiChatRoomsListResponse> {
  const params = new URLSearchParams();
  if (filter === 'unread') params.set('filter', 'unread');
  const key = `GET /api/chat-rooms?${params.toString()}`;
  return cachedFetch(
    key,
    CHAT_ROOMS_TTL_MS,
    () =>
      apiFetch<ApiChatRoomsListResponse>('/api/chat-rooms', {
        cache: 'no-store',
        searchParams: params,
      }),
    signal
  );
}

export function fetchChatRoom(
  roomId: string,
  signal?: AbortSignal
): Promise<ApiChatRoomDetail> {
  const key = `GET /api/chat-rooms/${roomId}`;
  return cachedFetch(
    key,
    CHAT_ROOM_TTL_MS,
    () =>
      apiFetch<ApiChatRoomDetail>(
        `/api/chat-rooms/${encodeURIComponent(roomId)}`,
        { cache: 'no-store' }
      ),
    signal
  );
}

export async function createChatRoom(args: {
  trainerId: string;
  firstMessage?: string;
}): Promise<ApiCreateChatRoomResponse> {
  const res = await apiFetch<ApiCreateChatRoomResponse>('/api/chat-rooms', {
    method: 'POST',
    body: args,
  });
  invalidateCache(/^GET \/api\/chat-rooms/);
  return res;
}

export async function postChatMessage(args: {
  roomId: string;
  body: string;
}): Promise<ApiChatMessage> {
  const res = await apiFetch<ApiChatMessage>(
    `/api/chat-rooms/${encodeURIComponent(args.roomId)}/messages`,
    { method: 'POST', body: { body: args.body } }
  );
  invalidateCache(`GET /api/chat-rooms/${args.roomId}`);
  invalidateCache(/^GET \/api\/chat-rooms\?/);
  return res;
}

export async function markChatRoomRead(roomId: string): Promise<{ ok: boolean }> {
  const res = await apiFetch<{ ok: boolean }>(
    `/api/chat-rooms/${encodeURIComponent(roomId)}/read`,
    { method: 'PATCH' }
  );
  // 목록의 unreadCount 가 바뀌므로 목록 캐시 초기화. 방 자체는 그대로.
  invalidateCache(/^GET \/api\/chat-rooms\?/);
  return res;
}
