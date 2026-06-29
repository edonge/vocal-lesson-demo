'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DoreLogo } from '@/components/brand/dore-logo';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push('/login');
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-white">
      <button
        type="button"
        onClick={() => router.push('/login')}
        className="flex flex-col items-center justify-center"
        aria-label="로그인 화면으로 이동"
      >
        <DoreLogo withTagline />
      </button>
    </main>
  );
}
