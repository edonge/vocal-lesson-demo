import { TopBar } from '@/components/layout/top-bar';

/**
 * 수강생 온보딩 (1단계: 기본 정보) — 추후 구현.
 * 현재는 라우트만 잡아두는 placeholder.
 */
export default function StudentOnboardingPage() {
  return (
    <>
      <TopBar title="수강생 온보딩" />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-ink-500">
        <p>수강생 온보딩이 여기에 들어갑니다.</p>
        <p className="mt-1 text-xs text-ink-400">
          기본 정보 → 지역 → 레슨 목적 → 장르 → 현재 실력 → 고민
        </p>
      </div>
    </>
  );
}
