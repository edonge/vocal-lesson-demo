'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
  BottomTabBar,
  HeroBanner,
  HomeHeader,
  ProfileCompletionModal,
  TrainerCard,
  type HeroBannerItem,
} from '@/components/home/home-components';
import { UnavailableDialog } from '@/components/ui/unavailable-dialog';
import { DORE_PICK_TRAINERS } from '@/data/home';
import { useMounted } from '@/hooks/use-mounted';
import { fetchHome } from '@/lib/api/home-client';
import { apiTrainerPreviewToUi } from '@/lib/adapters/trainer';
import { useOnboardingStore } from '@/stores/onboarding-store';
import type { ApiBanner, ApiHomeResponse } from '@/types/api';

const PROFILE_PROMPT_DISMISS_KEY = 'dore:profile-completion-dismissed-date';

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function adaptBanners(banners: ApiBanner[]): HeroBannerItem[] {
  return banners.map((banner) => ({
    id: banner.id,
    label: banner.title,
    // 서버는 hex 색을 내려준다. Tailwind 클래스로 시작하는 값도 있을 수 있어 분기.
    ...(banner.bgColor?.startsWith('bg-')
      ? { bgClassName: banner.bgColor }
      : banner.bgColor
        ? { bgColor: banner.bgColor }
        : {}),
  }));
}

export default function HomePage() {
  const router = useRouter();
  const mounted = useMounted();
  const student = useOnboardingStore((state) => state.student);
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [profilePromptDismissed, setProfilePromptDismissed] = useState(false);
  const [home, setHome] = useState<ApiHomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted) return;
    const dismissedDate = window.localStorage.getItem(PROFILE_PROMPT_DISMISS_KEY);
    setProfilePromptDismissed(dismissedDate === getLocalDateKey());
  }, [mounted]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetchHome(controller.signal)
      .then((data) => {
        setHome(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : 'unknown error';
        setError(message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  // API 실패 / 로딩 중에는 mock 으로 화면이 비지 않게 fallback
  const trainers = useMemo(() => {
    if (home?.dorePick) return home.dorePick.map(apiTrainerPreviewToUi);
    return DORE_PICK_TRAINERS;
  }, [home]);

  const banners = useMemo(
    () => (home?.banners ? adaptBanners(home.banners) : undefined),
    [home]
  );

  // 추천 헤더 안내 문구에 쓰는 지역. API 응답에 학생 지역 정보가 별도로 없어서
  // 기존처럼 로컬 store 의 student.regions 를 사용.
  const userDistrict = student.regions[1] || student.regions[0] || '성동구';

  const needsProfileCompletion = useMemo(() => {
    if (home?.profilePrompt) return home.profilePrompt.show;
    if (!mounted) return false;
    return (
      student.regions.length === 0 ||
      student.goals.length === 0 ||
      !student.birthYear
    );
  }, [home, mounted, student.birthYear, student.goals.length, student.regions.length]);

  const showProfilePrompt = needsProfileCompletion && !profilePromptDismissed;

  return (
    <>
      <main className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-gray-50">
        <HomeHeader onUnavailable={() => setUnavailableOpen(true)} />

        <div className="flex flex-1 flex-col gap-[30px] overflow-y-auto overflow-x-hidden px-5 pb-[116px] pt-[11px]">
          <HeroBanner banners={banners} />

          <section className="flex flex-col gap-[15px]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 className="text-[22px] font-bold leading-none tracking-normal text-black">
                  Dore Pick!
                </h2>
                <Link
                  href={`/search?filter=region&district=${encodeURIComponent(userDistrict)}`}
                  className="flex items-center gap-0.5 text-xs font-medium text-gray-400 underline underline-offset-2"
                >
                  전체
                  <ChevronRight size={14} />
                </Link>
              </div>
              <p className="text-xs font-medium leading-none tracking-normal text-gray-400">
                {userDistrict} 지역에서 요즘 가장 주목받는 트레이너를 확인해보세요
              </p>
            </div>

            {isLoading && !home ? (
              <HomeLoadingSkeleton />
            ) : (
              trainers.map((trainer) => (
                <TrainerCard
                  key={trainer.id}
                  trainer={trainer}
                  onUnavailable={() => setUnavailableOpen(true)}
                />
              ))
            )}

            {error ? (
              <p className="text-center text-xs text-gray-400">
                추천 데이터를 불러오지 못해 임시 데이터를 표시 중이에요.
              </p>
            ) : null}
          </section>
        </div>

        <BottomTabBar onUnavailable={() => setUnavailableOpen(true)} />
      </main>

      <ProfileCompletionModal
        open={showProfilePrompt}
        onClose={() => setProfilePromptDismissed(true)}
        onDismissToday={() => {
          window.localStorage.setItem(
            PROFILE_PROMPT_DISMISS_KEY,
            getLocalDateKey()
          );
          setProfilePromptDismissed(true);
        }}
        onComplete={() => router.push('/my')}
      />
      <UnavailableDialog
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
      />
    </>
  );
}

function HomeLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[188px] w-full animate-pulse rounded-lg border border-[#b3b1b1] bg-gray-100"
        />
      ))}
    </div>
  );
}
