import type { ApiChatRoomPreview } from '@/types/api';
import type { ChatPreview } from '@/data/chat';

/**
 * `2026.06.23.` 형식의 날짜 라벨. lastMessageAt 이 null 이면 빈 문자열.
 */
function formatDateLabel(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}.`;
}

export function apiChatRoomPreviewToUi(room: ApiChatRoomPreview): ChatPreview {
  return {
    id: room.id,
    name: room.trainer.name,
    meta: room.trainer.meta,
    date: formatDateLabel(room.lastMessageAt),
    message: room.lastMessage,
    unreadCount: room.unreadCount,
    avatarColor: room.trainer.avatarColor,
  };
}
