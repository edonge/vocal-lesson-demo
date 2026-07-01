import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { chatRoomDetailInclude, toChatRoomDetail } from '@/lib/api/chat';
import { jsonError, jsonUnauthorized } from '@/lib/api/request';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { roomId: string } }
) {
  const user = await getCurrentUser();
  if (!user) return jsonUnauthorized();
  const room = await prisma.chatRoom.findFirst({
    where: { id: params.roomId, studentId: user.id },
    include: chatRoomDetailInclude,
  });

  if (!room) return jsonError('Chat room not found', 404);

  return NextResponse.json(toChatRoomDetail(room));
}
