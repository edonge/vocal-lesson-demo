'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { FixedBottomButton } from '@/components/onboarding/onboarding-ui';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function OnboardingCompletePage() {
  const router = useRouter();
  const name = useOnboardingStore((state) => state.student.name);
  const displayName = name.trim() || '이현동';

  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center bg-white pt-[175px]">
      <section className="flex flex-1 flex-col items-center gap-[47px] text-center">
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-blue-200 text-blue-500">
          <Check size={48} strokeWidth={2.5} />
        </div>

        <div className="flex flex-col items-center gap-[29px]">
          <h1 className="text-2xl font-bold leading-tight tracking-normal text-black">
            환영합니다,
            <br />
            <span className="text-blue-600">{displayName}</span> 님!
          </h1>
          <p className="text-lg leading-tight tracking-normal text-gray-400">
            좋은 선생님을 만나는 첫걸음,
            <br />
            지금부터 도레가 도와드릴게요.
          </p>
        </div>
      </section>

      <FixedBottomButton onClick={() => router.push('/home')}>시작하기</FixedBottomButton>
    </main>
  );
}
