'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FixedBottomButton,
  OnboardingField,
  ProgressHeader,
} from '@/components/onboarding/onboarding-ui';
import { checkLoginId } from '@/lib/api/auth-client';

function getPasswordRuleState(password: string, passwordConfirm: string) {
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasThreeTypes = hasLetter && hasNumber && hasSpecial;
  const hasEnoughLength = password.length >= 8;
  const matchesConfirm = Boolean(password) && password === passwordConfirm;

  return {
    hasThreeTypes,
    hasEnoughLength,
    matchesConfirm,
    valid: hasThreeTypes && hasEnoughLength && matchesConfirm,
  };
}

export default function OnboardingAccountPage() {
  const router = useRouter();
  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [idCheckMessage, setIdCheckMessage] = useState<string | null>(null);
  const [checkingId, setCheckingId] = useState(false);

  const passwordRules = useMemo(
    () => getPasswordRuleState(password, passwordConfirm),
    [password, passwordConfirm]
  );

  const canContinue = useMemo(
    () => Boolean(accountId.trim() && passwordRules.valid),
    [accountId, passwordRules.valid]
  );

  const handleCheckLoginId = async () => {
    if (!accountId.trim() || checkingId) return;
    setCheckingId(true);
    setIdCheckMessage(null);
    try {
      const res = await checkLoginId(accountId);
      setIdCheckMessage(res.available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.');
    } catch (err) {
      setIdCheckMessage(err instanceof Error ? err.message : '아이디 확인에 실패했어요.');
    } finally {
      setCheckingId(false);
    }
  };

  const goNext = () => {
    if (!canContinue) return;
    window.sessionStorage.setItem(
      'dore:signup:draft',
      JSON.stringify({ loginId: accountId.trim(), password })
    );
    router.push('/onboarding/verify');
  };

  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center bg-white">
      <ProgressHeader step={1} />

      <section className="flex w-full flex-1 flex-col items-center gap-[43px]">
        <h1 className="text-xl font-semibold text-black">계정 정보를 입력해주세요</h1>

        <div className="flex w-[315px] flex-col gap-[30px]">
          <OnboardingField
            label="아이디"
            placeholder="예: dore2026"
            value={accountId}
            onChange={setAccountId}
            right={
              <button
                type="button"
                onClick={handleCheckLoginId}
                className="ml-2 flex h-[22px] w-[64px] shrink-0 items-center justify-center rounded border border-[#eeecec] text-xs text-black"
              >
                {checkingId ? '확인중' : '중복확인'}
              </button>
            }
          />
          {idCheckMessage ? (
            <p className="text-xs leading-tight text-gray-400">{idCheckMessage}</p>
          ) : null}
          <div className="flex flex-col gap-2">
            <OnboardingField
              label="비밀번호"
              placeholder="영문+숫자+특수문자 8자 이상"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <div className="space-y-1 text-xs leading-[18px]">
              <PasswordRule passed={passwordRules.hasThreeTypes}>
                영문, 숫자, 특수문자 3가지 조합
              </PasswordRule>
              <PasswordRule passed={passwordRules.hasEnoughLength}>
                8자 이상 입력
              </PasswordRule>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <OnboardingField
              label="비밀번호 확인"
              placeholder="비밀번호를 한 번 더 입력"
              type="password"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
            />
            {passwordConfirm ? (
              <PasswordRule passed={passwordRules.matchesConfirm}>
                비밀번호 확인 일치
              </PasswordRule>
            ) : null}
          </div>
        </div>
      </section>

      <FixedBottomButton
        disabled={!canContinue}
        onClick={goNext}
      >
        다음
      </FixedBottomButton>
    </main>
  );
}

function PasswordRule({
  passed,
  children,
}: {
  passed: boolean;
  children: React.ReactNode;
}) {
  return (
    <p className={passed ? 'text-blue-600' : 'text-gray-400'}>
      {passed ? '✓' : '•'} {children}
    </p>
  );
}
