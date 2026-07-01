'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FixedBottomButton,
  ProgressHeader,
  SelectBox,
  SelectPill,
} from '@/components/onboarding/onboarding-ui';
import {
  SEOUL_DISTRICTS,
  SEOUL_LOCATIONS,
  type SeoulDistrict,
} from '@/data/seoul-locations';
import { updateStudentProfile } from '@/lib/api/me-client';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useOnboardingStore } from '@/stores/onboarding-store';

const experienceOptions = [
  { label: '1년 이상', value: '상급' },
  { label: '1년 미만', value: '초급' },
  { label: '처음이에요!', value: '입문' },
] as const;

const currentYear = new Date().getFullYear();
const BIRTH_YEAR_OPTIONS = Array.from({ length: 75 }, (_, index) =>
  String(currentYear - 6 - index)
);

export default function OnboardingProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useRequireAuth();
  const student = useOnboardingStore((state) => state.student);
  const updateStudent = useOnboardingStore((state) => state.updateStudent);
  const [province] = useState('서울특별시');
  const [district, setDistrict] = useState<SeoulDistrict | ''>('성동구');
  const [neighborhood, setNeighborhood] = useState('행당1동');
  const [birthYear, setBirthYear] = useState(student.birthYear);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const neighborhoodOptions = useMemo(
    () => (district ? ['상관없음', ...SEOUL_LOCATIONS[district]] : []),
    [district]
  );

  const updateDistrict = (value: string) => {
    const nextDistrict = value as SeoulDistrict;
    setDistrict(nextDistrict);
    setNeighborhood('');
  };

  const handleComplete = async () => {
    if (isSaving || authLoading || !user) return;
    setIsSaving(true);
    setSaveError(null);

    // 1) store 에 마지막 입력값 반영. 후속 화면이 즉시 읽을 수 있도록.
    updateStudent({
      birthYear,
      regions: [province, district, neighborhood].filter(Boolean),
    });

    // 2) 서버 PATCH. 실패해도 온보딩 흐름은 막지 않는다 (다음 단계에서 재시도 가능).
    try {
      await updateStudentProfile({
        name: student.name || undefined,
        gender: student.gender ?? null,
        birthYear: birthYear ? Number(birthYear) : null,
        district: district || null,
        neighborhood:
          neighborhood && neighborhood !== '상관없음' ? neighborhood : null,
        skillLevel: student.skillLevel ?? null,
      });
      router.push('/onboarding/complete');
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : '저장에 실패했어요. 잠시 후 다시 시도해주세요.'
      );
      setIsSaving(false);
    }
  };

  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center bg-white">
      <ProgressHeader step={3} />

      <section className="flex w-full flex-1 flex-col items-center gap-[43px]">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="text-xl font-semibold text-black">마지막이에요</h1>
          <p className="text-sm leading-none tracking-normal text-gray-400">
            거의 완료 됐답니다!
          </p>
        </div>

        <div className="flex w-full flex-col gap-[43px] px-5">
          <div className="flex flex-col gap-2.5">
            <span className="text-[15px] font-bold leading-none text-gray-600">
              성별
            </span>
            <div className="flex gap-2.5">
              <SelectPill
                selected={student.gender === '남성' || student.gender === null}
                onClick={() => updateStudent({ gender: '남성' })}
              >
                남
              </SelectPill>
              <SelectPill
                selected={student.gender === '여성'}
                onClick={() => updateStudent({ gender: '여성' })}
              >
                여
              </SelectPill>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <SelectBox label="시/도" value={province} options={[province]} />
            <SelectBox
              label="시/군/구"
              value={district}
              placeholder="선택"
              options={SEOUL_DISTRICTS}
              onChange={updateDistrict}
            />
            <SelectBox
              label="읍/면/동"
              value={neighborhood}
              placeholder={district ? '선택' : '구 선택'}
              options={neighborhoodOptions}
              onChange={setNeighborhood}
              disabled={!district}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[15px] font-bold leading-none text-gray-600">
              출생연도
            </span>
            <SelectBox
              value={birthYear}
              placeholder="여기에서 선택해주세요"
              options={BIRTH_YEAR_OPTIONS}
              onChange={(value) => {
                setBirthYear(value);
                updateStudent({ birthYear: value });
              }}
              className="flex-none"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[15px] font-bold leading-none text-gray-600">
              레슨 경험 유무
            </span>
            <div className="flex gap-2.5">
              {experienceOptions.map((item) => (
                <SelectPill
                  key={item.label}
                  selected={
                    student.skillLevel === item.value ||
                    (!student.skillLevel && item.value === '상급')
                  }
                  onClick={() =>
                    updateStudent({
                      skillLevel: item.value,
                    })
                  }
                >
                  {item.label}
                </SelectPill>
              ))}
            </div>
          </div>

          {saveError ? (
            <p className="px-2 text-[12px] leading-tight text-danger">
              {saveError}
            </p>
          ) : null}
        </div>
      </section>

      <FixedBottomButton disabled={isSaving} onClick={handleComplete}>
        {isSaving ? '저장 중…' : '가입 완료'}
      </FixedBottomButton>
    </main>
  );
}
