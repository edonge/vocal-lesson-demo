'use client';

import { useMemo, useState } from 'react';
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
import {
  chatMessages,
  chatPreviews,
  chatTrainerInfo,
  type ChatMessage,
} from '@/data/chat';
import { cn } from '@/lib/cn';

export default function ChatDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState('');

  const preview = useMemo(
    () => chatPreviews.find((item) => item.id === params.id) ?? chatPreviews[0],
    [params.id]
  );

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
            avatarColor={preview.avatarColor}
            onProfile={() => router.push('/trainers/trainer-1')}
            onPayment={() => setUnavailableOpen(true)}
          />
        </header>

        <section className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-[92px] pt-2">
          <div className="flex justify-center">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-400 shadow-sm">
              2026.06.23. (화)
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {chatMessages.map((item) => (
              <MessageBubble key={item.id} message={item} />
            ))}
          </div>
        </section>

        <MessageInput
          value={message}
          onChange={setMessage}
          onSend={() => setMessage('')}
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
  avatarColor,
  onProfile,
  onPayment,
}: {
  avatarColor: string;
  onProfile: () => void;
  onPayment: () => void;
}) {
  return (
    <section className="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-[0_8px_24px_rgba(10,10,11,0.06)]">
      <div className="flex gap-3">
        <div
          className="h-[54px] w-[54px] shrink-0 rounded-full"
          style={{ backgroundColor: avatarColor }}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold leading-none tracking-normal text-black">
              {chatTrainerInfo.name}
            </h1>
            <p className="truncate text-xs font-medium leading-none text-gray-400">
              {chatTrainerInfo.meta}
            </p>
          </div>
          <p className="mt-2 truncate text-xs font-medium leading-none text-gray-600">
            {chatTrainerInfo.intro}
          </p>
          <div className="mt-3 flex gap-1.5">
            {chatTrainerInfo.tags.map((tag) => (
              <span
                key={tag}
                className="flex h-[25px] items-center rounded-lg border border-blue-200 bg-blue-50 px-2 text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-400">
        <span>{chatTrainerInfo.career}</span>
        <span>·</span>
        <span>후기 {chatTrainerInfo.reviews}</span>
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

function MessageBubble({ message }: { message: ChatMessage }) {
  const mine = message.sender === 'me';

  return (
    <div className={cn('flex flex-col gap-1', mine ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[78%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-[21px] shadow-sm',
          mine
            ? 'rounded-br-md bg-[#035ef3] text-white'
            : 'rounded-bl-md border border-gray-100 bg-white text-gray-900'
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
        {mine && message.read ? (
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
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-phone -translate-x-1/2 border-t border-gray-100 bg-white px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center rounded-full border border-gray-200 bg-gray-50 px-4">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="메시지를 입력하세요"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>

        <button
          type="button"
          aria-label="보내기"
          onClick={onSend}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#035ef3] text-white"
        >
          <Send size={18} fill="currentColor" />
        </button>
      </div>
    </footer>
  );
}
