'use client';

import { useState } from 'react';
import { ArrowRight, Copy, Phone, X } from 'lucide-react';
import { cn } from '@/lib/cn';

const TRAINER_CONTACT = '01094533410';
const TRAINER_CONTACT_DISPLAY = '010-9453-3410';

type TrainerContactButtonProps = {
  children: React.ReactNode;
  variant?: 'nav' | 'secondary';
  className?: string;
};

export function TrainerContactButton({
  children,
  variant = 'secondary',
  className,
}: TrainerContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyContact = async () => {
    try {
      await navigator.clipboard.writeText(TRAINER_CONTACT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const buttonStyles =
    variant === 'nav'
      ? 'hidden rounded-[10px] px-3.5 py-2 text-sm font-bold text-[#59657a] transition hover:bg-white hover:text-[#1f58e0] sm:inline-flex'
      : 'inline-flex min-h-12 items-center justify-center gap-2 rounded-[12px] border border-[#c9d8ff] bg-white/80 px-5 text-sm font-extrabold tracking-normal text-[#1f3f8f] transition duration-200 hover:border-[#8aaeff] hover:bg-white active:translate-y-px';

  return (
    <>
      <button
        type="button"
        className={cn(buttonStyles, className)}
        onClick={() => setIsOpen(true)}
      >
        {children}
        {variant === 'secondary' ? (
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        ) : null}
      </button>

      {isOpen ? (
        <div
          className="bg-[#101828]/54 fixed inset-0 z-[100] flex items-center justify-center px-5 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trainer-contact-title"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[28px] border border-white/80 bg-white/[0.94] p-6 shadow-[0_30px_90px_rgba(16,24,40,0.22)] backdrop-blur-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2b6cff]">
                  Trainer Contact
                </p>
                <h2
                  id="trainer-contact-title"
                  className="mt-3 text-2xl font-black text-[#101828]"
                >
                  트레이너 입점 문의
                </h2>
              </div>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8e4ff] text-[#59657a] transition hover:bg-[#eef5ff] hover:text-[#101828]"
                aria-label="닫기"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-5 text-sm leading-7 text-[#59657a]">
              도레 트레이너 입점은 아래 연락처로 문의해 주세요.
            </p>

            <div className="mt-6 rounded-[20px] border border-[#d8e4ff] bg-[#f8fbff] p-5">
              <p className="text-sm font-bold text-[#667085]">연락처</p>
              <p className="mt-2 text-3xl font-black tracking-normal text-[#101828]">
                {TRAINER_CONTACT_DISPLAY}
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${TRAINER_CONTACT}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[12px] bg-[#1f58e0] px-5 text-sm font-black text-white shadow-[0_18px_42px_rgba(31,88,224,0.22)] transition hover:bg-[#1749bd]"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                전화하기
              </a>
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[12px] border border-[#c9d8ff] bg-white px-5 text-sm font-black text-[#1f3f8f] transition hover:border-[#8aaeff]"
                onClick={copyContact}
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                {copied ? '복사됨' : '번호 복사'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
