'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Check,
  ChevronLeft,
  CreditCard,
  MoreVertical,
  Send,
  User,
} from 'lucide-react';
import { UnavailableDialog } from '@/components/ui/unavailable-dialog';
import { type ChatMessage } from '@/types/ui';
import {
  fetchChatRoom,
  markChatRoomRead,
  postChatMessage,
} from '@/lib/api/chat-client';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { cn } from '@/lib/cn';
import type { ApiChatRoomDetail } from '@/types/api';

/** UI 에서 다루는 메시지. 낙관적 업데이트를 위해 임시 메시지에는 `pending`/`failed` 마크. */
type UiMessage = ChatMessage & {
  pending?: boolean;
  failed?: boolean;
};

function nowClock(): string {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function ChatDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useRequireAuth();
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const [room, setRoom] = useState<ApiChatRoomDetail | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sendingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 진입 시 채팅방 로드 + 읽음 처리
  useEffect(() => {
    if (!params.id || authLoading || !user) return;
    const controller = new AbortController();
    setIsLoading(true);
    fetchChatRoom(params.id, controller.signal)
      .then((data) => {
        setRoom(data);
        setMessages(data.messages);
        setError(null);
        // 읽음 처리는 실패해도 본문에 영향 없음
        markChatRoomRead(params.id).catch(() => {});
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'unknown error');
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [params.id, authLoading, user]);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const handleSend = async () => {
    if (!params.id) return;
    const text = draft.trim();
    if (!text || sendingRef.current) return;

    const tempId = `tmp_${Math.random().toString(36).slice(2, 9)}`;
    const optimistic: UiMessage = {
      id: tempId,
      sender: 'me',
      text,
      time: nowClock(),
      read: false,
      pending: true,
    };

    sendingRef.current = true;
    setMessages((prev) => [...prev, optimistic]);
    setDraft('');

    try {
      const saved = await postChatMessage({ roomId: params.id, body: text });
      // 임시 메시지를 서버 응답으로 교체
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...saved, pending: false } : m))
      );
    } catch {
      // 실패: 임시 메시지에 실패 표시
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, pending: false, failed: true } : m
        )
      );
    } finally {
      sendingRef.current = false;
    }
  };

  if (isLoading && !room) {
    return (
      <main className="flex h-dvh items-center justify-center bg-[#f5f6f8]">
        <div className="flex flex-col items-center gap-3 text-sm text-gray-400">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-[#035ef3]" />
          <p>채팅방을 불러오는 중이에요</p>
        </div>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center gap-4 bg-[#f5f6f8] px-6 text-center">
        <p className="text-sm text-gray-500">
          {error
            ? '채팅방을 불러오지 못했어요.'
            : '존재하지 않는 채팅방이에요.'}
        </p>
        <button
          type="button"
          onClick={() => router.push('/chat')}
          className="h-10 rounded-lg bg-[#035ef3] px-4 text-sm font-semibold text-white"
        >
          상담 목록으로
        </button>
      </main>
    );
  }

  const trainer = room.trainer;

  return (
    <>
      <main className="relative flex h-dvh flex-col overflow-hidden bg-[#f5f6f8]">
        <header className="shrink-0 px-4 pb-3 pt-[58px]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="뒤로가기"
              className="flex h-10 w-10 items-center justify-center text-gray-950"
            >
              <ChevronLeft size={30} strokeWidth={2.4} />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="더보기"
                className="flex h-10 w-10 items-center justify-center text-gray-950"
              >
                <MoreVertical size={24} strokeWidth={2.3} />
              </button>
              {menuOpen ? (
                <ChatRoomMenu
                  onSelect={() => {
                    setMenuOpen(false);
                    setUnavailableOpen(true);
                  }}
                />
              ) : null}
            </div>
          </div>

          <TrainerProfileCard
            trainer={trainer}
            onProfile={() => router.push(`/trainers/${trainer.id}`)}
            onPayment={() => setUnavailableOpen(true)}
          />
        </header>

        <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-[92px] pt-2">
          {room.dateLabel ? (
            <div className="flex justify-center">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-400 shadow-sm">
                {room.dateLabel}
              </span>
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            {messages.map((item) => (
              <MessageBubble key={item.id} message={item} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </section>

        <MessageInput
          value={draft}
          onChange={setDraft}
          onSend={() => void handleSend()}
          disabled={!params.id}
        />
      </main>

      <UnavailableDialog
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
      />
    </>
  );
}

function TrainerProfileCard({
  trainer,
  onProfile,
  onPayment,
}: {
  trainer: ApiChatRoomDetail['trainer'];
  onProfile: () => void;
  onPayment: () => void;
}) {
  return (
    <section className="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-[0_8px_24px_rgba(10,10,11,0.06)]">
      <div className="flex gap-3">
        <div
          className="h-[54px] w-[54px] shrink-0 rounded-full"
          style={{ backgroundColor: trainer.avatarColor }}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold leading-none tracking-normal text-black">
              {trainer.name}
            </h1>
            <p className="truncate text-xs font-medium leading-none text-gray-400">
              {trainer.meta}
            </p>
          </div>
          {trainer.intro ? (
            <p className="mt-2 truncate text-xs font-medium leading-none text-gray-600">
              {trainer.intro}
            </p>
          ) : null}
          {trainer.tags.length > 0 ? (
            <div className="mt-3 flex gap-1.5">
              {trainer.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex h-[25px] items-center rounded-lg border border-blue-200 bg-blue-50 px-2 text-xs font-medium text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-400">
        <span>{trainer.career}</span>
        <span>·</span>
        <span>후기 {trainer.reviews}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onProfile}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-900"
        >
          <User size={16} />
          프로필 보기
        </button>
        <button
          type="button"
          onClick={onPayment}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-900"
        >
          <CreditCard size={16} />
          안전 결제하기
        </button>
      </div>
    </section>
  );
}

function MessageBubble({ message }: { message: UiMessage }) {
  const mine = message.sender === 'me';

  return (
    <div className={cn('flex flex-col gap-1', mine ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[78%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-[21px] shadow-sm',
          mine
            ? 'rounded-br-md bg-[#035ef3] text-white'
            : 'rounded-bl-md border border-gray-100 bg-white text-gray-900',
          message.pending && 'opacity-60',
          message.failed && 'bg-danger text-white'
        )}
      >
        {message.text}
      </div>
      <div
        className={cn(
          'flex items-center gap-1 text-[10px] font-medium text-gray-400',
          mine ? 'pr-1' : 'pl-1'
        )}
      >
        {message.failed ? (
          <span className="text-danger">전송 실패</span>
        ) : message.pending ? (
          <span>전송 중...</span>
        ) : mine && message.read ? (
          <Check
            size={11}
            strokeWidth={3}
            aria-label="읽음"
            className="text-[#035ef3]"
          />
        ) : null}
        <span>{message.time}</span>
      </div>
    </div>
  );
}

function ChatRoomMenu({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="absolute right-0 top-11 z-30 w-[154px] overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-[0_10px_30px_rgba(10,10,11,0.14)]">
      <button
        type="button"
        onClick={onSelect}
        className="flex h-11 w-full items-center px-4 text-left text-sm font-medium text-gray-900"
      >
        채팅방 나가기
      </button>
      <button
        type="button"
        onClick={onSelect}
        className="flex h-11 w-full items-center px-4 text-left text-sm font-semibold text-danger"
      >
        신고하기
      </button>
      <button
        type="button"
        onClick={onSelect}
        className="flex h-11 w-full items-center px-4 text-left text-sm font-medium text-gray-900"
      >
        채팅방 설정
      </button>
    </div>
  );
}

function MessageInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  const canSend = !disabled && value.trim().length > 0;

  return (
    <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-phone -translate-x-1/2 border-t border-gray-100 bg-white px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center rounded-full border border-gray-200 bg-gray-50 px-4">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                event.preventDefault();
                if (canSend) onSend();
              }
            }}
            placeholder="메시지를 입력하세요"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>

        <button
          type="button"
          aria-label="보내기"
          onClick={onSend}
          disabled={!canSend}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#035ef3] text-white',
            !canSend && 'opacity-40'
          )}
        >
          <Send size={18} fill="currentColor" />
        </button>
      </div>
    </footer>
  );
}
