'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Bookmark,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  Home,
  Play,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { UnavailableDialog } from '@/components/ui/unavailable-dialog';
import { type TrainerProfileDetail } from '@/data/trainer-profile';
import { apiTrainerDetailToUi } from '@/lib/adapters/trainer';
import { fetchTrainer } from '@/lib/api/trainers-client';
import { toggleBookmark } from '@/lib/api/bookmarks-client';
import { createChatRoom } from '@/lib/api/chat-client';
import { cn } from '@/lib/cn';

type ProfileTab = 'info' | 'works' | 'media' | 'reviews';
type ReviewSort = 'likes' | 'latest';
type ReviewReaction = 'like' | 'dislike';

const tabs: Array<{ key: ProfileTab; label: string }> = [
  { key: 'info', label: '기본 정보' },
  { key: 'works', label: '작업물' },
  { key: 'media', label: '미디어' },
  { key: 'reviews', label: '후기' },
];

export default function TrainerProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<TrainerProfileDetail | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  const [showFixedCta, setShowFixedCta] = useState(false);
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [reviewSort, setReviewSort] = useState<ReviewSort>('likes');
  const [reviewReactions, setReviewReactions] = useState<
    Record<string, ReviewReaction | undefined>
  >({});
  const [consultInFlight, setConsultInFlight] = useState(false);
  const [consultError, setConsultError] = useState<string | null>(null);
  const bookmarkInFlight = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleBookmark = async () => {
    if (!params.id || bookmarkInFlight.current) return;
    const previous = bookmarked;
    bookmarkInFlight.current = true;
    setBookmarked(!previous); // optimistic
    try {
      const res = await toggleBookmark(params.id, previous);
      setBookmarked(res.bookmarked);
    } catch {
      setBookmarked(previous); // rollback
    } finally {
      bookmarkInFlight.current = false;
    }
  };

  const handleStartConsult = async () => {
    if (!params.id || consultInFlight) return;
    setConsultInFlight(true);
    setConsultError(null);
    try {
      const { roomId } = await createChatRoom({ trainerId: params.id });
      router.push(`/chat/${roomId}`);
    } catch (err: unknown) {
      setConsultError(
        err instanceof Error ? err.message : '상담을 시작하지 못했어요. 잠시 후 다시 시도해주세요.'
      );
      setConsultInFlight(false);
    }
  };

  useEffect(() => {
    if (!params.id) return;
    const controller = new AbortController();
    setProfile(null);
    setProfileError(null);
    fetchTrainer(params.id, controller.signal)
      .then((data) => {
        setProfile(apiTrainerDetailToUi(data));
        setBookmarked(data.bookmarked);
        setProfileError(null);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setProfile(null);
        setProfileError(err instanceof Error ? err.message : 'unknown error');
      });
    return () => controller.abort();
  }, [params.id]);

  const handleScroll = () => {
    const node = scrollRef.current;
    if (!node) return;
    setShowFixedCta(node.scrollTop > node.clientHeight * 0.55);
  };

  // 히어로 ↔ 정보 섹션 사이의 임계점 기반 스냅.
  // 브라우저 기본 smooth scroll (~500ms) 은 너무 느려서 작은 스크롤이
  // "튕겨 돌아오는" 듯한 인상을 준다. 커스텀 ease-out (180ms) 으로 빠르게 보정.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    let settleTimer: number | undefined;
    let animFrame: number | undefined;
    let animating = false;

    const THRESHOLD_RATIO = 0.5; // 뷰포트의 50%를 넘겨야 다음 섹션으로 커밋
    const SNAP_DURATION = 180; // ms, 보정 애니메이션 길이
    const SETTLE_DELAY = 120; // ms, 모멘텀 스크롤이 끝난 뒤 결정

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animateTo = (target: number) => {
      const start = node.scrollTop;
      const distance = target - start;
      if (Math.abs(distance) < 1) return;
      const startTime = performance.now();
      animating = true;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / SNAP_DURATION, 1);
        node.scrollTop = start + distance * easeOutCubic(t);
        if (t < 1) {
          animFrame = window.requestAnimationFrame(step);
        } else {
          animating = false;
        }
      };
      animFrame = window.requestAnimationFrame(step);
    };

    const onSettle = () => {
      if (animating) return;
      const top = node.scrollTop;
      const heroH = node.clientHeight;
      // 경계 구간 바깥은 손대지 않음 (info 본문 스크롤 보호)
      if (top <= 0 || top >= heroH) return;

      const threshold = heroH * THRESHOLD_RATIO;
      const target = top >= threshold ? heroH : 0;
      if (Math.abs(top - target) < 4) return;
      animateTo(target);
    };

    const onScroll = () => {
      if (animating) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(onSettle, SETTLE_DELAY);
    };

    node.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      node.removeEventListener('scroll', onScroll);
      window.clearTimeout(settleTimer);
      if (animFrame) window.cancelAnimationFrame(animFrame);
    };
  }, []);

  if (!profile) {
    return (
      <main className="relative flex h-dvh items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-sm text-gray-400">
          {profileError ? (
            <>
              <p>트레이너 정보를 불러오지 못했어요.</p>
              <button
                type="button"
                onClick={() => router.push('/search')}
                className="h-10 rounded-lg bg-[#035ef3] px-4 text-sm font-semibold text-white"
              >
                탐색으로 돌아가기
              </button>
            </>
          ) : (
            <>
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-[#035ef3]" />
              <p>트레이너 정보를 불러오는 중이에요</p>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="relative h-dvh overflow-hidden bg-white">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto scroll-smooth"
        >
          <HeroSection
            profile={profile}
            onBack={() => router.back()}
            bookmarked={bookmarked}
            onBookmark={() => void handleBookmark()}
          />

          <section className="min-h-dvh bg-white pb-[104px]">
            <TabHeader activeTab={activeTab} onChange={setActiveTab} />
            <div className="flex flex-col gap-10 py-10">
              {activeTab === 'info' ? <InfoTab profile={profile} /> : null}
              {activeTab === 'works' ? <WorksTab profile={profile} /> : null}
              {activeTab === 'media' ? <MediaTab profile={profile} /> : null}
              {activeTab === 'reviews' ? (
                <ReviewsTab
                  profile={profile}
                  sort={reviewSort}
                  reactions={reviewReactions}
                  onSortChange={setReviewSort}
                  onReact={(reviewId, reaction) =>
                    setReviewReactions((current) => ({
                      ...current,
                      [reviewId]:
                        current[reviewId] === reaction ? undefined : reaction,
                    }))
                  }
                />
              ) : null}
            </div>
          </section>
        </div>

        <FixedCta
          visible={showFixedCta}
          onConsult={() => void handleStartConsult()}
          consultInFlight={consultInFlight}
          bookmarked={bookmarked}
          onBookmark={() => void handleBookmark()}
        />

        {consultError ? (
          <div
            role="alert"
            className="fixed bottom-[86px] left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-[12px] text-white"
            onAnimationEnd={() => setConsultError(null)}
          >
            {consultError}
          </div>
        ) : null}
      </main>

      <UnavailableDialog
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
      />
    </>
  );
}

function HeroSection({
  profile,
  onBack,
  bookmarked,
  onBookmark,
}: {
  profile: TrainerProfileDetail;
  onBack: () => void;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  return (
    <section className="relative h-dvh overflow-hidden bg-black text-white">
      <img
        src={profile.heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/85" />

      <header className="relative z-10 flex items-end justify-between px-[15px] pt-[75px]">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center text-white"
        >
          <ChevronLeft size={36} strokeWidth={2.6} />
        </button>
        <button
          type="button"
          aria-label="북마크"
          onClick={onBookmark}
          className="flex h-10 w-10 items-center justify-center text-white"
        >
          <Bookmark
            size={34}
            strokeWidth={2.4}
            fill={bookmarked ? 'currentColor' : 'none'}
          />
        </button>
      </header>

      <div className="relative z-10 flex h-[calc(100%-115px)] flex-col justify-end px-5 pb-[15px]">
        <div className="flex flex-col gap-2.5">
          <div className="flex h-20 items-center overflow-hidden">
            <h1 className="w-[300px] text-[50px] font-bold leading-[30px] tracking-normal">
              {profile.name}
            </h1>
          </div>
          <p className="py-2.5 text-base font-medium leading-none tracking-normal text-[#a2a2a2]">
            {profile.genres.join(' · ')}
          </p>
          <p className="py-2.5 text-base font-medium leading-none tracking-normal text-[#a2a2a2]">
            {profile.locationText}
          </p>
          <p className="py-2.5 text-xl font-medium leading-[30px] tracking-normal text-white">
            {profile.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="py-2.5 text-base font-semibold leading-none tracking-normal text-white">
            {profile.careerLabel}
          </p>
        </div>
      </div>
    </section>
  );
}

function TabHeader({
  activeTab,
  onChange,
}: {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}) {
  return (
    <div className="sticky top-0 z-20 flex h-[109px] items-end bg-gray-50 px-5 pt-20">
      <div className="flex h-full w-full items-end">
        {tabs.map((tab) => {
          const selected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                'flex h-full min-w-0 flex-1 items-center justify-center border-b-2 text-center text-base font-semibold leading-none tracking-normal',
                selected
                  ? 'border-[#035ef3] text-[#035ef3]'
                  : 'border-transparent text-gray-600'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InfoTab({ profile }: { profile: TrainerProfileDetail }) {
  return (
    <>
      <ContentSection title="이런 분께 추천해요" className="gap-5">
        <div className="flex flex-col gap-6">
          {profile.recommendedFor.map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <Check size={24} className="shrink-0 text-[#035ef3]" strokeWidth={2.5} />
              <p className="text-base font-semibold leading-none tracking-normal text-black">
                {item}
              </p>
            </div>
          ))}
        </div>
      </ContentSection>

      <Divider />

      <ContentSection title="레슨 정보" className="gap-5">
        <LessonInfoTable rows={profile.lessonInfo} />
      </ContentSection>

      <FacilityCards facilities={profile.facilities} />

      <Divider />

      <ContentSection title={`${profile.name} 님의 주요 태그`} className="gap-5">
        <div className="flex flex-wrap justify-center gap-x-[30px] gap-y-2.5">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="flex h-[38px] items-center rounded-lg border border-blue-500 bg-blue-50 px-[15px] text-[13px] font-normal leading-[19.5px] text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </ContentSection>

      <Divider />

      <ContentSection title="수업 방식" className="gap-7">
        <p className="whitespace-pre-line text-base font-semibold leading-[26px] tracking-normal text-black">
          {profile.lessonApproach}
        </p>
      </ContentSection>

      <Divider />

      <ContentSection title="학력" className="gap-5">
        <div className="flex flex-col gap-2 text-base font-semibold leading-[30px] text-black">
          {profile.education.map((item) => (
            <div key={item.school}>
              <p className="pl-6 before:mr-2 before:content-['•']">{item.school}</p>
              <p className="pl-11">{item.major}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <Divider />

      <ContentSection title="경력" className="gap-5">
        <div className="flex flex-col gap-3">
          {profile.careers.map((career) => (
            <div
              key={`${career.period}-${career.title}`}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <p className="text-xs font-semibold leading-none text-[#035ef3]">
                {career.period}
              </p>
              <p className="mt-2 text-base font-bold leading-none text-black">
                {career.title}
              </p>
              <p className="mt-2 text-sm font-medium leading-tight text-gray-600">
                {career.detail}
              </p>
            </div>
          ))}
        </div>
      </ContentSection>

      <Divider />

      <ContentSection title="추가 정보" className="gap-7">
        <p className="whitespace-pre-line px-[5px] text-base font-medium leading-[30px] tracking-normal text-black">
          {profile.extraInfo}
        </p>
      </ContentSection>
    </>
  );
}

function LessonInfoTable({ rows }: { rows: TrainerProfileDetail['lessonInfo'] }) {
  return (
    <div className="w-full border-y border-[#d6d6d6]">
      {rows.map((row) => (
        <div key={row.label} className="flex min-h-10 border-b border-[#e4e4e4] last:border-b-0">
          <div className="flex w-[100px] shrink-0 items-center justify-center bg-gray-50 text-base font-semibold text-black">
            {row.label}
          </div>
          <div className="flex min-w-0 flex-1 items-center px-5 text-base font-medium leading-tight text-black">
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function FacilityCards({
  facilities,
}: {
  facilities: TrainerProfileDetail['facilities'];
}) {
  return (
    <div className="flex w-full justify-center gap-2.5 px-5">
      {facilities.map((item) => {
        const Icon = item.label === '주차' ? Car : Home;
        return (
          <div
            key={item.label}
            className={cn(
              'flex aspect-square min-w-0 flex-1 flex-col items-center justify-center gap-2.5 rounded-xl border p-[30px] shadow-[2px_2px_4px_rgba(0,0,0,0.18)]',
              item.available
                ? 'border-blue-500 bg-blue-50'
                : 'border-[#e8e8e8] bg-white'
            )}
          >
            <div
              className={cn(
                'flex h-[50px] w-[50px] items-center justify-center rounded-full',
                item.available ? 'bg-blue-200 text-[#035ef3]' : 'bg-[#e8e8e8] text-black'
              )}
            >
              <Icon size={26} />
            </div>
            <div className="flex flex-col gap-[5px] text-center text-base leading-none">
              <p className="font-bold text-black">{item.label}</p>
              <p className={cn('font-medium', item.available ? 'text-[#035ef3]' : 'text-black')}>
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WorksTab({ profile }: { profile: TrainerProfileDetail }) {
  return (
    <>
      <ContentSection title="본인 작업물" className="gap-5">
        <div className="flex w-full flex-col gap-3">
          {profile.works.slice(0, 3).map((work, index) => (
            <WorkPlaceholder key={`${work.title}-${index}`} work={work} index={index} />
          ))}
        </div>
      </ContentSection>
      <Divider />
      <ContentSection title="프로듀싱 · 피쳐링" className="gap-5">
        <div className="flex w-full flex-col gap-3">
          {profile.works.slice(2, 5).map((work, index) => (
            <WorkPlaceholder key={`${work.title}-feature-${index}`} work={work} index={index + 3} />
          ))}
        </div>
      </ContentSection>
    </>
  );
}

function WorkPlaceholder({
  work,
  index,
}: {
  work: TrainerProfileDetail['works'][number];
  index: number;
}) {
  const isAudio = work.type === 'audio';
  return (
    <div
      className={cn(
        'relative flex w-full overflow-hidden bg-gray-900 text-white',
        isAudio ? 'h-[61px]' : 'h-[133px]'
      )}
    >
      <div
        className={cn(
          'absolute inset-0',
          index % 3 === 0
            ? 'bg-gradient-to-r from-orange-500 via-gray-800 to-blue-500'
            : index % 3 === 1
              ? 'bg-gradient-to-br from-[#111827] via-[#394150] to-[#111827]'
              : 'bg-gradient-to-br from-zinc-900 via-zinc-700 to-black'
        )}
      />
      <div className="relative z-10 flex w-full items-center gap-3 px-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-black">
          <Play size={16} fill="currentColor" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{work.title}</p>
          <p className="truncate text-[11px] font-medium text-white/70">{work.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function MediaTab({ profile }: { profile: TrainerProfileDetail }) {
  return (
    <>
      <ContentSection title="사진" className="gap-5">
        <MediaGrid items={profile.mediaPhotos} type="photo" />
      </ContentSection>
      <ContentSection title="영상" className="gap-5">
        <MediaGrid items={profile.mediaVideos} type="video" />
      </ContentSection>
    </>
  );
}

function MediaGrid({ items, type }: { items: string[]; type: 'photo' | 'video' }) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      {items.map((item, index) => (
        <div
          key={item}
          className={cn(
            'relative flex aspect-square items-end overflow-hidden rounded-lg bg-gray-100 p-3',
            index % 4 === 0
              ? 'bg-blue-100'
              : index % 4 === 1
                ? 'bg-gray-200'
                : index % 4 === 2
                  ? 'bg-orange-light'
                  : 'bg-green-light'
          )}
        >
          {type === 'video' ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white">
                <Play size={18} fill="currentColor" />
              </div>
            </div>
          ) : null}
          <span className="relative z-10 text-sm font-semibold text-gray-900">{item}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewsTab({
  profile,
  sort,
  reactions,
  onSortChange,
  onReact,
}: {
  profile: TrainerProfileDetail;
  sort: ReviewSort;
  reactions: Record<string, ReviewReaction | undefined>;
  onSortChange: (sort: ReviewSort) => void;
  onReact: (reviewId: string, reaction: ReviewReaction) => void;
}) {
  const sortedReviews = [...profile.reviews].sort((a, b) => {
    if (sort === 'latest') {
      return b.createdAt.localeCompare(a.createdAt);
    }
    return b.likes - a.likes || b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <ContentSection
      title="후기"
      className="gap-5"
      rightSlot={
        <label className="flex items-center gap-0.5 text-sm font-medium text-[#b1b1b1]">
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as ReviewSort)}
            className="appearance-none bg-transparent pr-1 text-right outline-none"
          >
            <option value="likes">좋아요 많은 순</option>
            <option value="latest">최신순</option>
          </select>
          <ChevronDown size={16} />
        </label>
      }
    >
      <div className="flex w-full flex-col gap-5">
        {sortedReviews.map((review, index) => (
          <ReviewCard
            key={review.id}
            review={review}
            index={index}
            reaction={reactions[review.id]}
            onReact={(reaction) => onReact(review.id, reaction)}
          />
        ))}
      </div>
    </ContentSection>
  );
}

function ReviewCard({
  review,
  index,
  reaction,
  onReact,
}: {
  review: TrainerProfileDetail['reviews'][number];
  index: number;
  reaction?: ReviewReaction;
  onReact: (reaction: ReviewReaction) => void;
}) {
  const likeDelta = reaction === 'like' ? 1 : 0;
  const dislikeDelta = reaction === 'dislike' ? 1 : 0;

  return (
    <article className="flex h-[126px] overflow-hidden rounded-lg border border-[#b3b1b1] bg-white">
      <div
        className={cn(
          'h-full w-[130px] shrink-0',
          index % 2 === 0 ? 'bg-orange-light' : 'bg-blue-150'
        )}
      >
        <div className="h-full w-full bg-gradient-to-br from-white/70 via-transparent to-black/10" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between px-[15px]">
        <div className="flex flex-1 flex-col justify-between pb-2.5 pt-[15px]">
          <div className="flex items-center gap-2.5">
            <p className="text-xl font-bold leading-none tracking-normal text-black">
              {review.name}
            </p>
            <p className="text-xs font-medium leading-none tracking-normal text-[#a2a2a2]">
              {review.region}
            </p>
          </div>
          <p className="line-clamp-3 text-xs font-medium leading-tight tracking-normal text-black">
            {review.body}
          </p>
        </div>
        <div className="flex h-6 items-end justify-between py-2">
          <p className="text-xs font-medium leading-none tracking-normal text-[#999]">
            {review.ago}
          </p>
          <div className="flex items-end gap-2.5 text-xs font-semibold text-black">
            <button
              type="button"
              aria-label="좋아요"
              onClick={() => onReact('like')}
              className="flex items-center"
            >
              <ThumbsUp
                size={16}
                fill={reaction === 'like' ? 'currentColor' : 'none'}
              />
            </button>
            <span>{review.likes + likeDelta}</span>
            <button
              type="button"
              aria-label="싫어요"
              onClick={() => onReact('dislike')}
              className="flex items-center"
            >
              <ThumbsDown
                size={16}
                fill={reaction === 'dislike' ? 'currentColor' : 'none'}
              />
            </button>
            <span>{review.dislikes + dislikeDelta}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function ContentSection({
  title,
  children,
  className,
  rightSlot,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <section className={cn('flex w-full flex-col items-start px-5', className)}>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl font-extrabold leading-none tracking-normal text-gray-600">
          {title}
        </h2>
        {rightSlot}
      </div>
      {children}
    </section>
  );
}

function Divider() {
  return <div className="mx-5 h-px bg-[#d6d6d6]" />;
}

function FixedCta({
  visible,
  onConsult,
  consultInFlight,
  bookmarked,
  onBookmark,
}: {
  visible: boolean;
  onConsult: () => void;
  consultInFlight?: boolean;
  bookmarked: boolean;
  onBookmark: () => void;
}) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-1/2 z-30 flex w-full max-w-phone -translate-x-1/2 items-start justify-center gap-2.5 border border-[#e8e8e8] bg-white px-[26px] py-5 transition-transform duration-200',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <button
        type="button"
        onClick={onConsult}
        disabled={consultInFlight}
        className={cn(
          'flex min-w-0 flex-1 items-center justify-center rounded-lg bg-[#035ef3] px-6 py-[11px] text-sm font-bold leading-[19.5px] text-white',
          consultInFlight && 'opacity-70'
        )}
      >
        {consultInFlight ? '상담방을 만드는 중...' : '상담하기'}
      </button>
      <button
        type="button"
        aria-label="북마크"
        onClick={onBookmark}
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-[#ebebeb] p-[7px] text-black"
      >
        <Bookmark size={24} fill={bookmarked ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
