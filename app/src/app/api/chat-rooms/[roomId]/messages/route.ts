import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { jsonError } from '@/lib/api/request';
import { toChatMessage } from '@/lib/api/chat';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const user = await getCurrentUser();
  const body = (await request.json().catch(() => null)) as { body?: string } | null;
  const text = body?.body?.trim();
  if (!text) return jsonError('body is required');

  const room = await prisma.chatRoom.findFirst({
    where: { id: params.roomId, studentId: user.id },
    select: { id: true },
  });
  if (!room) return jsonError('Chat room not found', 404);

  const now = new Date();
  const message = await prisma.message.create({
    data: {
      roomId: params.roomId,
      senderUserId: user.id,
      senderRole: 'student',
      body: text,
      createdAt: now,
    },
  });

  await prisma.chatRoom.update({
    where: { id: params.roomId },
    data: {
      status: 'active',
      lastMessage: text,
      lastMessageAt: now,
      trainerUnreadCount: { increment: 1 },
    },
  });

  return NextResponse.json(toChatMessage(message), { status: 201 });
}
