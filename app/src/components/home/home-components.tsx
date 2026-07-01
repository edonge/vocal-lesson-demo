'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bookmark,
  Calendar,
  Home,
  type LucideIcon,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  Target,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { HOME_ASSETS, HOME_BANNERS, type TrainerPreview } from '@/data/home';
import { toggleBookmark } from '@/lib/api/bookmarks-client';

type HomeHeaderProps = {
  onUnavailable: () => void;
};

export function HomeHeader({ onUnavailable }: HomeHeaderProps) {
  return (
    <header className="flex h-[129px] w-full shrink-0 items-end justify-between bg-gray-50 px-5 pb-[15px] pt-[75px]">
      <h1 className="text-[32px] font-bold leading-none tracking-normal text-black">
        홈
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

/**
 * HeroBanner 가 받는 정규화된 배너 모양.
 * - `bgClassName`: Tailwind 클래스(`bg-blue-500` 등)일 때 사용
 * - `bgColor`: hex/rgb 등 임의 색일 때 inline style 로 사용
 * - 둘 다 없으면 기본색 (`bg-blue-500`)
 */
export type HeroBannerItem = {
  id: string;
  label: string;
  bgClassName?: string;
  bgColor?: string;
};

type HeroBannerProps = {
  banners?: HeroBannerItem[];
};

const FALLBACK_HERO_BANNERS: HeroBannerItem[] = HOME_BANNERS.map((banner) => ({
  id: banner.id,
  label: banner.label,
  bgClassName: banner.className,
}));

export function HeroBanner({ banners }: HeroBannerProps = {}) {
  const items =
    banners && banners.length > 0 ? banners : FALLBACK_HERO_BANNERS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const count = items.length;

  const getLoopOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  const move = (direction: 'prev' | 'next') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDragOffset(0);
    setActiveIndex((current) =>
      direction === 'prev' ? (current - 1 + count) % count : (current + 1) % count
    );
  };

  const handleTouchMove = (clientX: number) => {
    if (touchStartX === null || isAnimating) return;
    const delta = clientX - touchStartX;
    setDragOffset(Math.max(-180, Math.min(180, delta)));
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX === null) return;
    const delta = clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      move(delta > 0 ? 'prev' : 'next');
    } else {
      setDragOffset(0);
    }
    setTouchStartX(null);
  };

  return (
    <section
      className="relative h-[250px] w-full touch-pan-y overflow-visible"
      onTouchStart={(event) => {
        if (isAnimating) return;
        setTouchStartX(event.touches[0]?.clientX ?? null);
      }}
      onTouchMove={(event) => handleTouchMove(event.touches[0]?.clientX ?? 0)}
      onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
    >
      {items.map((banner, index) => {
        const offset = getLoopOffset(index);
        const isCenter = offset === 0;
        const isAdjacent = Math.abs(offset) <= 1;
        const fallbackClassName =
          banner.bgClassName ?? (banner.bgColor ? undefined : 'bg-blue-500');

        return (
          <button
            key={banner.id}
            type="button"
            aria-label={banner.label}
            onClick={() => {
              if (offset === -1) move('prev');
              if (offset === 1) move('next');
            }}
            onTransitionEnd={() => {
              if (isCenter) setIsAnimating(false);
            }}
            className={cn(
              'absolute left-0 top-0 h-full w-full rounded-lg border border-gray-100 text-left will-change-transform',
              touchStartX === null
                ? 'transition-[transform,opacity] duration-500 ease-out'
                : 'transition-none',
              !isAdjacent && 'pointer-events-none opacity-0',
              isAdjacent && 'opacity-100',
              fallbackClassName
            )}
            style={{
              transform: `translateX(calc(${offset * 100}% + ${
                offset * 10 + dragOffset
              }px))`,
              zIndex: 10 - Math.abs(offset),
              ...(banner.bgColor ? { backgroundColor: banner.bgColor } : null),
            }}
          >
            <span className="absolute left-5 top-5 text-base font-semibold text-white">
              {banner.label}
            </span>
            {isCenter ? (
              <span className="absolute bottom-[16px] right-[15px] text-xs font-medium leading-none tracking-normal text-white">
                {activeIndex + 1} / {count} &gt;
              </span>
            ) : null}
          </button>
        );
      })}
    </section>
  );
}

type TrainerCardProps = {
  trainer: TrainerPreview;
  onUnavailable: () => void;
};

export function TrainerCard({ trainer }: TrainerCardProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(trainer.bookmarked ?? false);
  const inFlight = useRef(false);

  // 부모가 새 데이터로 trainer 를 갱신하면 카드 상태도 동기화.
  // 사용자의 in-flight 토글 중에는 덮어쓰지 않는다.
  useEffect(() => {
    if (inFlight.current) return;
    setBookmarked(trainer.bookmarked ?? false);
  }, [trainer.bookmarked]);

  const handleBookmark = async () => {
    if (inFlight.current) return;
    const previous = bookmarked;
    const next = !previous;
    inFlight.current = true;
    setBookmarked(next); // optimistic
    try {
      const res = await toggleBookmark(trainer.id, previous);
      setBookmarked(res.bookmarked);
    } catch {
      setBookmarked(previous); // rollback
    } finally {
      inFlight.current = false;
    }
  };

  const openProfile = () => router.push(`/trainers/${trainer.id}`);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openProfile}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') openProfile();
      }}
      className="flex h-[188px] w-full cursor-pointer overflow-hidden rounded-lg border border-[#b3b1b1] bg-gray-50 text-left"
    >
      <div className="h-full w-[130px] shrink-0 overflow-hidden">
        <img
          src={trainer.image}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between px-[15px]">
        <div className="flex flex-1 flex-col justify-between pb-2.5 pt-[15px]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="shrink-0 text-xl font-bold leading-none tracking-normal text-black">
                {trainer.name}
              </span>
              <span className="truncate text-xs font-medium leading-none tracking-normal text-[#a2a2a2]">
                {trainer.location} · {trainer.genre}
              </span>
            </div>
            <button
              type="button"
              aria-label="북마크"
              onClick={(event) => {
                event.stopPropagation();
                void handleBookmark();
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center text-black"
            >
              <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="text-xs font-medium leading-none tracking-normal text-[#5d63ff]">
            {trainer.highlight}
          </p>
          <p className="line-clamp-2 text-xs font-medium leading-tight tracking-normal text-black">
            {trainer.description}
          </p>
          <div className="flex gap-2.5">
            {trainer.tags.map((tag) => (
              <span
                key={tag}
                className="flex h-[25px] items-center rounded-lg border border-[#e1e1e1] bg-blue-50 px-[7px] text-xs font-medium text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex h-6 items-start justify-between py-2 text-xs leading-none tracking-normal">
          <span className="text-[#999]">
            {trainer.career} · 후기 {trainer.reviews}
          </span>
          <span className="font-semibold text-black">{trainer.price}</span>
        </div>
      </div>
    </article>
  );
}

type BottomTabBarProps = {
  active?: 'home' | 'search' | 'chat' | 'my';
  onUnavailable: () => void;
};

const tabs = [
  { key: 'home', label: '홈', Icon: Home },
  { key: 'search', label: '탐색', Icon: Search },
  { key: 'chat', label: '채팅', Icon: MessageSquare },
  { key: 'my', label: '마이', Icon: User },
] as const;

export function BottomTabBar({ active = 'home', onUnavailable }: BottomTabBarProps) {
  const router = useRouter();

  return (
    <nav className="fixed bottom-[14px] left-1/2 z-20 w-full max-w-phone -translate-x-1/2 px-[7px]">
      <div className="flex h-[66px] items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-[15px]">
        {tabs.map(({ key, label, Icon }) => {
          const selected = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                if (selected) return;
                if (key === 'home') {
                  router.push('/home');
                  return;
                }
                if (key === 'search') {
                  router.push('/search');
                  return;
                }
                if (key === 'chat') {
                  router.push('/chat');
                  return;
                }
                if (key === 'my') {
                  router.push('/my');
                  return;
                }
                onUnavailable();
              }}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center justify-center gap-2 text-[10px] leading-none tracking-normal',
                selected ? 'text-blue-500' : 'text-gray-400'
              )}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

type ProfileCompletionModalProps = {
  open: boolean;
  onClose: () => void;
  onDismissToday: () => void;
  onComplete: () => void;
};

export function ProfileCompletionModal({
  open,
  onClose,
  onDismissToday,
  onComplete,
}: ProfileCompletionModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-9">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-completion-title"
        className="relative flex w-full max-w-[329px] flex-col items-center gap-5 overflow-hidden rounded-lg bg-white p-[15px] text-center"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="ml-auto flex h-4 w-4 items-center justify-center text-gray-950"
        >
          <X size={16} />
        </button>

        <img
          src={HOME_ASSETS.profileModal}
          alt=""
          className="h-[137px] w-[137px] object-cover"
          draggable={false}
        />

        <h2
          id="profile-completion-title"
          className="text-xl font-bold leading-tight tracking-normal text-black"
        >
          선생님을 추천받기 전에
          <br />
          프로필을 완성해주세요
        </h2>

        <p className="text-sm font-semibold leading-tight tracking-normal text-[#939090]">
          남겨주신 정보를 바탕으로
          <br />
          딱 맞는 선생님을 찾아드릴게요.
        </p>

        <div className="flex w-[233px] items-end justify-between">
          <ProfileNeed Icon={MapPin} label="레슨 지역" />
          <ProfileNeed Icon={Target} label="레슨 목표" />
          <ProfileNeed Icon={Calendar} label="가능 시간" />
        </div>

        <div className="flex flex-col items-center gap-[15px]">
          <button
            type="button"
            onClick={onComplete}
            className="h-[39px] w-[257px] rounded-lg bg-[#106cff] text-sm font-medium tracking-normal text-white"
          >
            프로필 완성하기
          </button>
          <button
            type="button"
            onClick={onDismissToday}
            className="text-xs font-semibold tracking-normal text-[#9d9d9d]"
          >
            오늘은 그만 보기
          </button>
        </div>
      </section>
    </div>
  );
}

function ProfileNeed({
  Icon,
  label,
}: {
  Icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-end gap-[5px]">
      <Icon size={20} strokeWidth={2} className="text-blue-500" />
      <span className="text-xs font-medium leading-none tracking-normal text-black">
        {label}
      </span>
    </div>
  );
}
