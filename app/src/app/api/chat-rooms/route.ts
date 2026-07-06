import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { chatRoomPreviewInclude, toChatRoomPreview } from '@/lib/api/chat';
import { jsonError, jsonUnauthorized } from '@/lib/api/request';
import { withServerTiming } from '@/lib/api/timing';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return withServerTiming('chat-rooms', async () => {
    const user = await getCurrentUser();
    if (!user) return jsonUnauthorized();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');

    const rooms = await prisma.chatRoom.findMany({
      where: {
        studentId: user.id,
        ...(filter === 'unread' ? { studentUnreadCount: { gt: 0 } } : {}),
      },
      include: chatRoomPreviewInclude,
      orderBy: [{ lastMessageAt: 'desc' }, { updatedAt: 'desc' }],
    });

    return NextResponse.json({ items: rooms.map(toChatRoomPreview) });
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonUnauthorized();
  const body = (await request.json().catch(() => null)) as {
    trainerId?: string;
    firstMessage?: string;
  } | null;

  if (!body?.trainerId) return jsonError('trainerId is required');

  const trainer = await prisma.trainerProfile.findUnique({
    where: { id: body.trainerId },
    select: { id: true },
  });
  if (!trainer) return jsonError('Trainer not found', 404);

  const existing = await prisma.chatRoom.findUnique({
    where: { studentId_trainerId: { studentId: user.id, trainerId: body.trainerId } },
  });
  if (existing) return NextResponse.json({ roomId: existing.id });

  const firstMessage = body.firstMessage?.trim() || '상담 문의드립니다.';
  const now = new Date();
  const room = await prisma.chatRoom.create({
    data: {
      studentId: user.id,
      trainerId: body.trainerId,
      status: 'new',
      lastMessage: firstMessage,
      lastMessageAt: now,
      trainerUnreadCount: 1,
      messages: {
        create: {
          senderUserId: user.id,
          senderRole: 'student',
          body: firstMessage,
          createdAt: now,
        },
      },
    },
  });

  return NextResponse.json({ roomId: room.id }, { status: 201 });
}
