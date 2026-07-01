'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeOff } from 'lucide-react';
import { DoreLogo } from '@/components/brand/dore-logo';
import { login } from '@/lib/api/auth-client';
import { useSession } from '@/hooks/use-session';
import { UnavailableDialog } from '@/components/ui/unavailable-dialog';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading: sessionLoading } = useSession();
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && user) router.replace('/home');
  }, [router, sessionLoading, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await login({ loginId, password });
      router.replace('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했어요.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-white px-[50px]">
        <section className="flex w-full flex-col items-center gap-[41px]">
          <DoreLogo withTagline />

          <form className="flex w-full max-w-[302px] flex-col" onSubmit={handleSubmit}>
            <label className="text-base font-medium text-black" htmlFor="loginId">
              아이디
            </label>
            <input
              id="loginId"
              name="loginId"
              type="text"
              value={loginId}
              onChange={(event) => setLoginId(event.target.value)}
              placeholder="예: dore2026"
              className="mt-2 h-8 border-0 border-b border-gray-200 bg-transparent px-0 text-sm text-black outline-none placeholder:text-gray-400 focus:border-blue-500"
            />

            <label className="mt-8 text-base font-medium text-black" htmlFor="password">
              비밀번호
            </label>
            <div className="mt-2 flex h-8 items-center border-b border-gray-200 focus-within:border-blue-500">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-black outline-none"
              />
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-end text-gray-400"
                aria-label="비밀번호 보기"
              >
                <EyeOff size={16} />
              </button>
            </div>

            {error ? (
              <p className="mt-3 text-xs leading-tight text-danger">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || !loginId.trim() || !password}
              className="mt-5 h-[45px] rounded bg-gray-400 text-base font-medium text-white transition hover:bg-gray-600 disabled:opacity-60"
            >
              {isSubmitting ? '로그인 중…' : '로그인'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 text-[13px] font-bold text-[#8f8f8f]">
            <Link href="/signup">회원가입</Link>
            <span>|</span>
            <button type="button" onClick={() => setUnavailableOpen(true)}>
              ID/비번 찾기
            </button>
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
