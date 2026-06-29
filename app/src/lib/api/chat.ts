import type { Prisma } from '@prisma/client';
import type { ApiChatMessage, ApiChatRoomPreview } from '@/types/api';
import { formatDateKey, timeLabel } from '@/lib/api/format';

export const chatRoomPreviewInclude = {
  trainer: {
    include: {
      district: true,
      genres: { include: { genre: true } },
    },
  },
} satisfies Prisma.ChatRoomInclude;

export const chatRoomDetailInclude = {
  trainer: {
    include: {
      district: true,
      genres: { include: { genre: true } },
      tags: { include: { tag: true } },
    },
  },
  messages: { orderBy: { createdAt: 'asc' } },
} satisfies Prisma.ChatRoomInclude;

type ChatRoomPreviewRow = Prisma.ChatRoomGetPayload<{
  include: typeof chatRoomPreviewInclude;
}>;

type ChatRoomDetailRow = Prisma.ChatRoomGetPayload<{
  include: typeof chatRoomDetailInclude;
}>;

export function toChatRoomPreview(room: ChatRoomPreviewRow): ApiChatRoomPreview {
  const genre = room.trainer.genres[0]?.genre.name ?? 'Kpop';
  return {
    id: room.id,
    trainer: {
      id: room.trainer.id,
      name: room.trainer.displayName,
      meta: `${room.trainer.district?.name ?? '서울'} · ${genre}`,
      avatarColor: '#002fff',
    },
    lastMessage: room.lastMessage ?? '',
    lastMessageAt: room.lastMessageAt?.toISOString() ?? null,
    unreadCount: room.studentUnreadCount,
  };
}

export function toChatRoomDetail(room: ChatRoomDetailRow) {
  const genre = room.trainer.genres[0]?.genre.name ?? 'Kpop';
  return {
    id: room.id,
    trainer: {
      id: room.trainer.id,
      name: room.trainer.displayName,
      meta: `${room.trainer.district?.name ?? '서울'} · ${genre}`,
      intro: room.trainer.intro ?? '',
      tags: room.trainer.tags.map((item) => item.tag.name).slice(0, 3),
      career: `경력 ${room.trainer.careerYears}년`,
      reviews: room.trainer.reviewCount,
      avatarColor: '#002fff',
    },
    dateLabel: formatDateKey(room.messages[0]?.createdAt ?? room.createdAt),
    messages: room.messages.map(toChatMessage),
  };
}

export function toChatMessage(message: ChatRoomDetailRow['messages'][number]): ApiChatMessage {
  return {
    id: message.id,
    sender: message.senderRole === 'student' ? 'me' : 'trainer',
    text: message.body,
    time: timeLabel(message.createdAt),
    read: Boolean(message.readAt),
  };
}
