'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

type TopBarProps = {
  title?: string;
  hideBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
};

/**
 * 모바일 앱 상단 바. 기본은 뒤로가기 + 타이틀.
 */
export function TopBar({ title, hideBack, onBack, right }: TopBarProps) {
  const router = useRouter();
  const handleBack = () => (onBack ? onBack() : router.back());

  return (
    <div className="flex h-[52px] flex-shrink-0 items-center gap-2 px-3">
      {hideBack ? (
        <div className="w-9" />
      ) : (
        <button
          aria-label="뒤로가기"
          onClick={handleBack}
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-ink-100"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      <div className="text-[15px] font-semibold text-ink-700">{title}</div>
      <div className="ml-auto">{right}</div>
    </div>
  );
}
