import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { jsonError } from '@/lib/api/request';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PATCH(
  _request: Request,
  { params }: { params: { roomId: string } }
) {
  const user = await getCurrentUser();
  const room = await prisma.chatRoom.findFirst({
    where: { id: params.roomId, studentId: user.id },
    select: { id: true },
  });
  if (!room) return jsonError('Chat room not found', 404);

  await prisma.$transaction([
    prisma.message.updateMany({
      where: {
        roomId: params.roomId,
        senderRole: 'trainer',
        readAt: null,
      },
      data: { readAt: new Date() },
    }),
    prisma.chatRoom.update({
      where: { id: params.roomId },
      data: { studentUnreadCount: 0 },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
