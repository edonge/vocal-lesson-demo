'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AgreementRow,
  FixedBottomButton,
  OnboardingField,
  ProgressHeader,
} from '@/components/onboarding/onboarding-ui';
import { UnavailableDialog } from '@/components/ui/unavailable-dialog';
import { signup } from '@/lib/api/auth-client';
import { useOnboardingStore } from '@/stores/onboarding-store';

export default function OnboardingVerifyPage() {
  const router = useRouter();
  const updateStudent = useOnboardingStore((state) => state.updateStudent);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreements, setAgreements] = useState({
    terms: true,
    privacy: true,
    marketing: true,
  });
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const allAgreed = agreements.terms && agreements.privacy && agreements.marketing;
  const requiredAgreed = agreements.terms && agreements.privacy;

  const canContinue = useMemo(
    () => name.trim() && phone.trim() && requiredAgreed,
    [name, phone, requiredAgreed]
  );

  const toggleAll = () => {
    const next = !allAgreed;
    setAgreements({
      terms: next,
      privacy: next,
      marketing: next,
    });
  };

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements((current) => ({ ...current, [key]: !current[key] }));
  };

  const next = async () => {
    if (!canContinue || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    const rawDraft = window.sessionStorage.getItem('dore:signup:draft');
    const draft = rawDraft ? JSON.parse(rawDraft) as { loginId?: string; password?: string } : {};
    if (!draft.loginId || !draft.password) {
      setSubmitError('계정 정보를 다시 입력해주세요.');
      setIsSubmitting(false);
      router.push('/onboarding');
      return;
    }
    try {
      await signup({
        loginId: draft.loginId,
        password: draft.password,
        name: name.trim(),
        phone,
        termsAgreed: agreements.terms,
        privacyAgreed: agreements.privacy,
        marketingAgreed: agreements.marketing,
      });
      window.sessionStorage.removeItem('dore:signup:draft');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '회원가입에 실패했어요.');
      setIsSubmitting(false);
      return;
    }
    updateStudent({ name });
    router.push('/onboarding/profile');
  };

  return (
    <>
      <main className="flex min-h-dvh flex-1 flex-col items-center justify-between bg-white">
        <ProgressHeader step={2} />

        <section className="flex h-[536px] w-full flex-col items-center gap-[43px]">
          <h1 className="text-xl font-semibold text-black">
            간단한 본인 인증 절차에요
          </h1>

          <div className="flex w-[315px] flex-col gap-[43px]">
            <OnboardingField
              label="이름"
              placeholder="실명으로 입력해주세요"
              value={name}
              onChange={setName}
            />

            <div className="flex w-full flex-col gap-1.5">
              <span className="text-[15px] font-bold leading-none tracking-normal text-gray-600">
                전화번호
              </span>
              <div className="flex h-12 items-center rounded-xl border border-gray-200 bg-white px-[15px] focus-within:border-blue-500">
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="- 제외하고 입력"
                  className="min-w-0 flex-1 text-sm outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setUnavailableOpen(true)}
                  className="flex h-[22px] w-[43px] items-center justify-center rounded border border-[#eeecec] text-sm text-black"
                >
                  인증
                </button>
              </div>
            </div>

            <div className="rounded-[14px] bg-gray-50 px-4 py-[14px]">
              <AgreementRow
                label="전체 동의"
                strong
                checked={allAgreed}
                onToggle={toggleAll}
              />
              <AgreementRow
                prefix="[필수]"
                label="서비스 이용약관 동의"
                checked={agreements.terms}
                onToggle={() => toggleAgreement('terms')}
                onView={() => setUnavailableOpen(true)}
              />
              <AgreementRow
                prefix="[필수]"
                label="개인정보 처리방침 동의"
                checked={agreements.privacy}
                onToggle={() => toggleAgreement('privacy')}
                onView={() => setUnavailableOpen(true)}
              />
              <AgreementRow
                prefix="[선택]"
                mutedPrefix
                label="마케팅 정보 수신 동의"
                checked={agreements.marketing}
                onToggle={() => toggleAgreement('marketing')}
                onView={() => setUnavailableOpen(true)}
              />
            </div>
          </div>

          {submitError ? (
            <p className="px-2 text-[12px] leading-tight text-danger">
              {submitError}
            </p>
          ) : null}
        </section>

        <FixedBottomButton disabled={!canContinue || isSubmitting} onClick={next}>
          {isSubmitting ? '가입 중…' : '가입 완료'}
        </FixedBottomButton>
      </main>
      <UnavailableDialog
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
      />
    </>
  );
}
