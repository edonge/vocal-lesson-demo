'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Settings } from 'lucide-react';
import { BottomTabBar } from '@/components/home/home-components';
import { UnavailableDialog } from '@/components/ui/unavailable-dialog';
import { type ChatPreview } from '@/data/chat';
import { fetchChatRooms } from '@/lib/api/chat-client';
import { apiChatRoomPreviewToUi } from '@/lib/adapters/chat';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { cn } from '@/lib/cn';

type ChatFilter = 'all' | 'unread';

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useRequireAuth();
  const [filter, setFilter] = useState<ChatFilter>('all');
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [items, setItems] = useState<ChatPreview[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    const controller = new AbortController();
    setIsLoading(true);
    fetchChatRooms(filter, controller.signal)
      .then((res) => {
        setItems(res.items.map(apiChatRoomPreviewToUi));
        setError(null);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'unknown error');
        setItems([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [authLoading, user, filter]);

  const chats = useMemo(() => items ?? [], [items]);
  const isEmpty = !isLoading && chats.length === 0;

  return (
    <>
      <main className="relative flex min-h-dvh flex-1 flex-col bg-gray-50">
        <ChatHeader onUnavailable={() => setUnavailableOpen(true)} />

        <section className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[116px]">
          <div className="px-5 pb-5">
            <FilterTabs value={filter} onChange={setFilter} />
          </div>

          {isLoading && !items ? (
            <ChatListSkeleton />
          ) : isEmpty ? (
            <EmptyState filter={filter} hasError={Boolean(error)} />
          ) : (
            <div className="flex flex-col gap-5">
              {chats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  onClick={() => router.push(`/chat/${chat.id}`)}
                />
              ))}
            </div>
          )}

          {error && chats.length > 0 ? (
            <p className="px-5 pt-3 text-center text-[11px] text-gray-400">
              최신 목록을 불러오지 못했어요.
            </p>
          ) : null}
        </section>

        <BottomTabBar
          active="chat"
          onUnavailable={() => setUnavailableOpen(true)}
        />
      </main>

      <UnavailableDialog
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
      />
    </>
  );
}

function ChatHeader({ onUnavailable }: { onUnavailable: () => void }) {
  return (
    <header className="flex h-[129px] w-full shrink-0 items-end justify-between bg-gray-50 px-5 pb-[15px] pt-[75px]">
      <h1 className="text-[32px] font-bold leading-none tracking-normal text-black">
        상담
      </h1>
      <button
        type="button"
        onClick={onUnavailable}
        aria-label="설정"
        className="flex h-8 w-8 items-center justify-center text-gray-950"
      >
        <Settings size={30} strokeWidth={2.5} />
      </button>
    </header>
  );
}

function ChatListSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex h-[66px] w-full items-start gap-4 bg-white px-[15px] py-2.5"
        >
          <span className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            <span className="h-3 w-full animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  filter,
  hasError,
}: {
  filter: ChatFilter;
  hasError: boolean;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-5 pb-20 text-center text-sm leading-tight text-[#a6a6a6]">
      {hasError ? (
        <p>
          상담 목록을 불러오지 못했어요.
          <br />
          잠시 후 다시 시도해주세요.
        </p>
      ) : filter === 'unread' ? (
        <p>안 읽은 상담이 없어요.</p>
      ) : (
        <p>
          아직 시작한 상담이 없어요.
          <br />
          마음에 드는 트레이너에게 상담을 시작해보세요.
        </p>
      )}
    </div>
  );
}

function FilterTabs({
  value,
  onChange,
}: {
  value: ChatFilter;
  onChange: (value: ChatFilter) => void;
}) {
  return (
    <div className="flex h-[30px] items-center gap-2.5">
      <FilterTab
        active={value === 'all'}
        label="전체"
        onClick={() => onChange('all')}
      />
      <FilterTab
        active={value === 'unread'}
        label="안읽음"
        onClick={() => onChange('unread')}
      />
    </div>
  );
}

function FilterTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[30px] items-center gap-1.5 rounded-full border px-[15px] text-[13px] font-normal leading-[19.5px] tracking-normal',
        active
          ? 'border-blue-500 bg-blue-50 text-blue-500'
          : 'border-[#ececec] bg-white text-black'
      )}
    >
      {active ? (
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-blue-500 text-white">
          <Check size={10} strokeWidth={3} />
        </span>
      ) : null}
      {label}
    </button>
  );
}

function ChatListItem({
  chat,
  onClick,
}: {
  chat: ChatPreview;
  onClick: () => void;
}) {
  const unread = chat.unreadCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[66px] w-full items-start gap-4 bg-white px-[15px] py-2.5 text-left"
    >
      <span
        className="h-10 w-10 shrink-0 rounded-full"
        style={{ backgroundColor: chat.avatarColor }}
        aria-hidden="true"
      />

      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex min-w-0 items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2.5">
            <span
              className={cn(
                'shrink-0 text-[15px] font-bold leading-none tracking-normal',
                unread ? 'text-black' : 'text-gray-400'
              )}
            >
              {chat.name}
            </span>
            <span
              className={cn(
                'truncate text-xs font-medium leading-none tracking-normal',
                unread ? 'text-gray-500' : 'text-[#a2a2a2]'
              )}
            >
              {chat.meta}
            </span>
          </span>
          <span
            className={cn(
              'shrink-0 text-[10px] font-medium leading-none tracking-normal',
              unread ? 'text-gray-500' : 'text-[#a2a2a2]'
            )}
          >
            {chat.date}
          </span>
        </span>

        <span className="flex min-w-0 items-center gap-[5px]">
          <span
            className={cn(
              'min-w-0 flex-1 truncate text-xs font-normal leading-[19.5px] tracking-normal',
              unread ? 'text-black' : 'text-[#9b9090]'
            )}
          >
            {chat.message}
          </span>
          {chat.unreadCount > 0 ? (
            <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-blue-500 px-0.5 text-[10px] font-normal leading-[19.5px] tracking-normal text-white">
              {chat.unreadCount}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}
