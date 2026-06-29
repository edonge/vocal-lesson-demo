import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

/**
 * 선택 가능한 칩 (온보딩 / 필터 등에 공용).
 */
export function Chip({ selected, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-full border px-[14px] py-[10px] text-sm font-medium transition',
        selected
          ? 'border-brand-500 bg-brand-50 font-semibold text-brand-700'
          : 'border-ink-200 bg-ink-50 text-ink-700 hover:bg-ink-100',
        className
      )}
      {...props}
    />
  );
}
