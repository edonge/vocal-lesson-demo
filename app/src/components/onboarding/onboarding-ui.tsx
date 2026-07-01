'use client';

import { ChevronDown, ChevronLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';

type ProgressHeaderProps = {
  step: 1 | 2 | 3;
};

export function ProgressHeader({ step }: ProgressHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex w-full shrink-0 items-center gap-3.5 px-[27px] pb-[30px] pt-[60px]">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="뒤로가기"
        className="flex h-6 w-6 items-center justify-center text-gray-950"
      >
        <ChevronLeft size={26} strokeWidth={3} />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <div className="flex min-w-0 flex-1 gap-1">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={cn(
                'h-1 flex-1 rounded-sm',
                item < step && 'bg-blue-300',
                item === step && 'bg-blue-500',
                item > step && 'bg-gray-100'
              )}
            />
          ))}
        </div>
        <div className="min-w-[30px] text-right text-xs font-bold tracking-[0.24px]">
          <span className="text-blue-700">{step}</span>
          <span className="text-gray-600">/3</span>
        </div>
      </div>
    </header>
  );
}

type FieldProps = {
  label: string;
  helper?: string;
  error?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  right?: React.ReactNode;
};

export function OnboardingField({
  label,
  helper,
  error,
  placeholder,
  type = 'text',
  value,
  onChange,
  right,
}: FieldProps) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-[15px] font-bold leading-none tracking-normal text-gray-600">
        {label}
      </span>
      <span className="flex h-12 items-center rounded-xl border border-gray-200 bg-white px-[15px] focus-within:border-blue-500">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-gray-950 outline-none placeholder:text-gray-400"
        />
        {right}
      </span>
      {helper ? (
        <span className="text-sm leading-[18px] text-gray-400">{helper}</span>
      ) : null}
      {error ? (
        <span className="text-sm leading-[18px] text-danger">{error}</span>
      ) : null}
    </label>
  );
}

type SelectBoxProps = {
  label?: string;
  value: string;
  placeholder?: string;
  options?: readonly string[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function SelectBox({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled,
  className,
}: SelectBoxProps) {
  return (
    <label className={cn('flex min-w-0 flex-1 flex-col gap-1.5', className)}>
      {label ? (
        <span className="text-[15px] font-bold leading-none tracking-normal text-gray-600">
          {label}
        </span>
      ) : null}
      <span
        className={cn(
          'relative flex h-12 w-full items-center rounded-xl border border-gray-200 bg-white text-sm text-gray-950',
          disabled && 'bg-gray-50 text-gray-400'
        )}
      >
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          className={cn(
            'h-full w-full appearance-none rounded-xl bg-transparent px-[15px] pr-9 outline-none',
            !value && 'text-gray-400'
          )}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {(options ?? (value ? [value] : [])).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-[15px] top-1/2 shrink-0 -translate-y-1/2 text-gray-950"
        />
      </span>
    </label>
  );
}

type PillProps = {
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

export function SelectPill({ selected, children, onClick }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[38px] items-center gap-1.5 rounded-full border px-[15px] text-[13px] leading-[19.5px]',
        selected
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 bg-white text-gray-900'
      )}
    >
      {selected ? (
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-blue-500 text-white">
          <Check size={10} strokeWidth={3} />
        </span>
      ) : null}
      {children}
    </button>
  );
}

type FixedBottomButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export function FixedBottomButton({
  children,
  disabled,
  onClick,
}: FixedBottomButtonProps) {
  return (
    <div className="mt-auto w-full bg-gradient-to-t from-white from-[60%] to-white/0 px-5 pb-[60px] pt-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'flex h-[52px] w-full items-center justify-center rounded-[14px] text-[15px] font-normal tracking-[-0.15px]',
          disabled ? 'bg-gray-100 text-gray-400' : 'bg-blue-500 text-white'
        )}
      >
        {children}
      </button>
    </div>
  );
}

type AgreementRowProps = {
  label: string;
  prefix?: string;
  mutedPrefix?: boolean;
  strong?: boolean;
  checked?: boolean;
  onToggle?: () => void;
  onView?: () => void;
};

export function AgreementRow({
  label,
  prefix,
  mutedPrefix,
  strong,
  checked = true,
  onToggle,
  onView,
}: AgreementRowProps) {
  return (
    <div className="flex min-h-[37px] items-center gap-2.5 border-t border-gray-100 first:border-t-0">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
          checked
            ? 'border-blue-500 bg-blue-500 text-white'
            : 'border-gray-200 bg-white text-transparent'
        )}
        aria-pressed={checked}
        aria-label={`${label} ${checked ? '동의 해제' : '동의'}`}
      >
        <Check size={12} strokeWidth={3} />
      </button>
      <span className="flex min-w-0 flex-1 items-center gap-1.5 text-[12.6px] text-gray-900">
        {prefix ? (
          <span className={mutedPrefix ? 'text-gray-400' : 'text-blue-700'}>
            {prefix}
          </span>
        ) : null}
        <span className={strong ? 'text-[13.2px]' : ''}>{label}</span>
      </span>
      {onView ? (
        <button
          type="button"
          onClick={onView}
          className="text-[11.4px] text-gray-400 underline"
        >
          보기
        </button>
      ) : null}
    </div>
  );
}
