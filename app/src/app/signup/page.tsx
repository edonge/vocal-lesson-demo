'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Home, UserRound } from 'lucide-react';
import { DoreLogo } from '@/components/brand/dore-logo';
import { cn } from '@/lib/cn';
import { UnavailableDialog } from '@/components/ui/unavailable-dialog';
import { useOnboardingStore } from '@/stores/onboarding-store';

const roleCards = [
  {
    title: '수강생',
    description: '원하는 트레이너 한 눈에 찾기',
    disabled: false,
    Icon: UserRound,
  },
  {
    title: '트레이너',
    description: '수강생 모집/관리하기',
    disabled: true,
    Icon: Home,
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const setRole = useOnboardingStore((state) => state.setRole);

  const startStudentSignup = () => {
    setRole('student');
    router.push('/onboarding');
  };

  return (
    <>
      <main className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-white px-[43px] py-[108px]">
        <section className="flex w-full max-w-[316px] flex-col items-center gap-[60px]">
          <DoreLogo />

          <div className="flex w-full flex-col items-center gap-[15px] text-center">
            <h1 className="text-xl font-semibold leading-normal text-black">
              환영해요!
              <br />
              어떻게 시작할까요?
            </h1>
            <p className="text-xs font-medium leading-tight tracking-normal text-gray-400">
              회원 유형에 따라 사용하는 화면이 다릅니다.
              <br />
              가입 후 변경할 수 없으니 신중히 선택해주세요.
            </p>
          </div>

          <div className="flex w-full flex-col gap-7">
            {roleCards.map(({ title, description, disabled, Icon }) => {
              const content = (
                <div
                  className={cn(
                    'flex h-[127px] w-full items-center rounded-lg border border-[#bbbaba] bg-white px-6 transition',
                    disabled ? 'opacity-60' : 'hover:border-blue-500'
                  )}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
                    <Icon size={24} strokeWidth={2} />
                  </span>
                  <span className="ml-6 flex min-w-0 flex-1 flex-col text-left">
                    <span className="text-xl font-semibold text-black">{title}</span>
                    <span className="mt-2 text-sm leading-none tracking-normal text-gray-400">
                      {description}
                    </span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-gray-400" />
                </div>
              );

              return disabled ? (
                <button
                  key={title}
                  type="button"
                  onClick={() => setUnavailableOpen(true)}
                  className="text-left"
                >
                  {content}
                </button>
              ) : (
                <button
                  key={title}
                  type="button"
                  onClick={startStudentSignup}
                  aria-label={`${title}으로 시작하기`}
                  className="text-left"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </section>
      </main>
      <UnavailableDialog
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
      />
    </>
  );
}
