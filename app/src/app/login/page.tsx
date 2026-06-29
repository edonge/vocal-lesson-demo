'use client';

import Link from 'next/link';
import { useState } from 'react';
import { EyeOff } from 'lucide-react';
import { DoreLogo } from '@/components/brand/dore-logo';
import { UnavailableDialog } from '@/components/ui/unavailable-dialog';

export default function LoginPage() {
  const [unavailableOpen, setUnavailableOpen] = useState(false);

  return (
    <>
      <main className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-white px-[50px]">
        <section className="flex w-full flex-col items-center gap-[41px]">
          <DoreLogo withTagline />

          <form className="flex w-full max-w-[302px] flex-col">
            <label className="text-base font-medium text-black" htmlFor="email">
              이메일 주소
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="예: dore@dore.kr"
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

            <button
              type="button"
              onClick={() => setUnavailableOpen(true)}
              className="mt-5 h-[45px] rounded bg-gray-400 text-base font-medium text-white transition hover:bg-gray-600"
            >
              로그인
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
