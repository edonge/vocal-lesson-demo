import { TopBar } from '@/components/layout/top-bar';

/**
 * 강사 온보딩 — 추후 구현.
 */
export default function TeacherOnboardingPage() {
  return (
    <>
      <TopBar title="강사 온보딩" />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-ink-500">
        <p>강사 온보딩이 여기에 들어갑니다.</p>
        <p className="mt-1 text-xs text-ink-400">
          프로필 기본 → 지역 → 레슨 대상 → 전문 분야 → 가격 → 한 줄 소개
        </p>
      </div>
    </>
  );
}
