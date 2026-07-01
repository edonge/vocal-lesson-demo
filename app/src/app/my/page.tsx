'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Settings,
} from 'lucide-react';
import musicNoteAsset from '../../../assets/music_note.png';
import { BottomTabBar } from '@/components/home/home-components';
import { UnavailableDialog } from '@/components/ui/unavailable-dialog';
import { cn } from '@/lib/cn';
import { useMe } from '@/hooks/use-me';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useMounted } from '@/hooks/use-mounted';
import {
  deriveMeDisplay,
  meToStudentStorePatch,
  studentStoreToUpdatePayload,
} from '@/lib/adapters/me';
import { updateStudentProfile } from '@/lib/api/me-client';
import { useOnboardingStore } from '@/stores/onboarding-store';

type SectionKey =
  | 'goals'
  | 'admission'
  | 'hobby'
  | 'problems'
  | 'event'
  | 'audition'
  | 'other'
  | 'intro';

const lessonGoalOptions = [
  '취미',
  '입시',
  '축가/행사',
  '가수 지망 / 오디션',
  '이중에 없어요',
];

const admissionMajorOptions = [
  '실용 음악',
  '성악',
  '뮤지컬',
  '국악/전통음악',
  'KPOP/아이돌',
  '연기 전공',
  '이중에 없어요',
];

const genreOptions = [
  '발라드',
  'R&B',
  '락/밴드',
  '팝송',
  '인디',
  'KPOP/아이돌',
  '뮤지컬',
  '아직 잘 모르겠어요',
];

const auditionDirectionOptions = [
  '기획사 오디션',
  '보컬',
  '싱어송라이터',
  '밴드/인디',
  'KPOP/아이돌',
  '뮤지컬',
  '방송/경연',
  '힙합/랩',
];

const problemOptions = [
  '노래방에서 잘 부르고 싶어요',
  '기초 발성부터 배우고 싶어요',
  '고음이 편해지고 싶어요',
  '음치·박자를 개선하고 싶어요',
  '좋아하는 곡을 완성하고 싶어요',
  '커버/녹음을 준비하고 있어요',
  '밴드·동아리 공연을 준비해요',
  '아직 잘 모르겠어요',
];

const currentYear = new Date().getFullYear();
const birthYearOptions = Array.from({ length: 75 }, (_, index) =>
  String(currentYear - 6 - index)
);
const eventYearOptions = Array.from({ length: 6 }, (_, index) =>
  String(currentYear + index)
);
const eventMonthOptions = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, '0')
);

export default function MyPage() {
  const mounted = useMounted();
  const student = useOnboardingStore((state) => state.student);
  const updateStudent = useOnboardingStore((state) => state.updateStudent);
  const { user, isLoading: authLoading } = useRequireAuth();
  const { me } = useMe();
  const meDisplay = deriveMeDisplay(me);
  const hydratedRef = useRef(false);
  const skipNextSaveRef = useRef(false);
  const saveTimerRef = useRef<number | undefined>(undefined);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error'>(
    'idle'
  );
  const [unavailableOpen, setUnavailableOpen] = useState(false);

  // 1) 서버 응답으로 store 를 한 번 hydrate. 첫 번째 store 변경(=hydrate 자체)은 저장 skip.
  useEffect(() => {
    if (authLoading || !user) return;
    if (!me || hydratedRef.current) return;
    hydratedRef.current = true;
    const patch = meToStudentStorePatch(me);
    if (Object.keys(patch).length > 0) {
      skipNextSaveRef.current = true;
      updateStudent(patch);
    }
  }, [authLoading, user, me, updateStudent]);

  // 2) hydrate 이후의 store 변경은 디바운스로 PATCH.
  useEffect(() => {
    if (authLoading || !user) return;
    if (!hydratedRef.current) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      setSaveStatus('saving');
      updateStudentProfile(studentStoreToUpdatePayload(student))
        .then((response) => {
          // 서버가 정규화/계산한 결과로 store 다시 hydrate.
          const patch = meToStudentStorePatch({
            id: null,
            role: null,
            name: null,
            phone: null,
            studentProfile: response.studentProfile,
          });
          if (Object.keys(patch).length > 0) {
            skipNextSaveRef.current = true;
            updateStudent(patch);
          }
          setSaveStatus('idle');
        })
        .catch(() => setSaveStatus('error'));
    }, 800);

    return () => window.clearTimeout(saveTimerRef.current);
  }, [authLoading, user, student, updateStudent]);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    goals: true,
    admission: false,
    hobby: false,
    problems: false,
    event: false,
    audition: false,
    other: false,
    intro: false,
  });
  const [problemPickerOpen, setProblemPickerOpen] = useState(false);

  const display = useMemo(() => {
    const goals = mounted ? student.goals : [];
      const genres = mounted ? student.genres : [];
      const regions = mounted ? student.regions : [];
      const mainProblems = mounted ? student.mainProblems : [];
      const goal = goals[0] || '취미';

    return {
      // 서버 값 우선. 없으면 store, 그래도 없으면 기존 기본값.
      name: meDisplay.name || student.name || '이현동',
      region:
        meDisplay.district || regions[1] || regions[0] || '성동구',
      primaryGoal: goal,
      goals: goals.length > 0 ? goals : ['취미'],
      genres,
      mainProblems,
      detail: mounted ? student.mainProblemDetail : '',
      admissionMajor: mounted ? student.admissionMajor ?? '' : '',
      eventYear: mounted ? student.eventYear ?? '' : '',
      eventMonth: mounted ? student.eventMonth ?? '' : '',
      eventDay: mounted ? student.eventDay ?? '' : '',
      eventSongName: mounted ? student.eventSongName ?? '' : '',
      auditionDirection: mounted ? student.auditionDirection ?? '' : '',
      otherLessonDescription: mounted ? student.otherLessonDescription ?? '' : '',
      birthYear: mounted ? student.birthYear : '',
    };
  }, [mounted, student, meDisplay.name, meDisplay.district]);

  const eventDayOptions = useMemo(() => {
    const year = Number(display.eventYear || currentYear);
    const month = Number(display.eventMonth || '1');
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) =>
      String(index + 1).padStart(2, '0')
    );
  }, [display.eventMonth, display.eventYear]);

  const completionScore = useMemo(() => {
    const branchComplete =
      (display.primaryGoal === '입시' && Boolean(display.admissionMajor)) ||
      (display.primaryGoal === '취미' &&
        display.genres.length > 0 &&
        display.mainProblems.length > 0) ||
      (display.primaryGoal === '축가/행사' &&
        Boolean(
          display.eventYear &&
            display.eventMonth &&
            display.eventDay &&
            display.eventSongName.trim()
        )) ||
      (display.primaryGoal === '가수 지망 / 오디션' &&
        Boolean(display.birthYear && display.auditionDirection)) ||
      (display.primaryGoal === '이중에 없어요' &&
        Boolean(display.otherLessonDescription.trim()));

    let score = 25;
    if (display.primaryGoal) score += 20;
    if (branchComplete) score += 25;
    if (display.detail.trim()) score += 30;
    return Math.min(score, 100);
  }, [display]);

  const toggleSection = (key: SectionKey) => {
    setOpenSections((current) => ({ ...current, [key]: !current[key] }));
  };

  const selectGoal = (value: string) => {
    updateStudent({
      goals: [value],
      genres: value === '취미' ? student.genres : [],
      mainProblems: value === '취미' ? student.mainProblems : [],
      admissionMajor: value === '입시' ? student.admissionMajor ?? '' : '',
      eventYear: value === '축가/행사' ? student.eventYear ?? '' : '',
      eventMonth: value === '축가/행사' ? student.eventMonth ?? '' : '',
      eventDay: value === '축가/행사' ? student.eventDay ?? '' : '',
      eventSongName: value === '축가/행사' ? student.eventSongName ?? '' : '',
      auditionDirection:
        value === '가수 지망 / 오디션' ? student.auditionDirection ?? '' : '',
      otherLessonDescription:
        value === '이중에 없어요' ? student.otherLessonDescription ?? '' : '',
    });
  };

  const selectGenre = (value: string) => {
    const current = student.genres;
    if (current.includes(value)) {
      updateStudent({ genres: current.filter((item) => item !== value) });
      return;
    }
    if (current.length >= 2) return;
    updateStudent({ genres: [...current, value] });
  };

  const selectProblem = (value: string) => {
    updateStudent({ mainProblems: [value] });
    setProblemPickerOpen(false);
  };

  const handleToggleSection = (key: SectionKey) => {
    toggleSection(key);
    if (key !== 'problems') setProblemPickerOpen(false);
  };

  const updateEventDate = (key: 'eventYear' | 'eventMonth', value: string) => {
    const nextYear = Number(key === 'eventYear' ? value : display.eventYear || currentYear);
    const nextMonth = Number(key === 'eventMonth' ? value : display.eventMonth || '1');
    const lastDay = new Date(nextYear, nextMonth, 0).getDate();
    const patch = { [key]: value } as Record<'eventYear' | 'eventMonth', string>;

    updateStudent({
      ...patch,
      eventDay:
        display.eventDay && Number(display.eventDay) > lastDay
          ? String(lastDay).padStart(2, '0')
          : display.eventDay,
    });
  };

  if (!mounted) {
    display.goals = ['취미'];
  }

  return (
    <>
      <main className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-gray-50">
        {saveStatus !== 'idle' ? (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              'fixed left-1/2 top-[14px] z-40 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-medium shadow-sm',
              saveStatus === 'saving' && 'bg-black/60 text-white',
              saveStatus === 'error' && 'bg-danger text-white'
            )}
          >
            {saveStatus === 'saving' ? '저장 중…' : '저장에 실패했어요'}
          </div>
        ) : null}

        <div className="flex flex-1 flex-col gap-[31px] overflow-y-auto pb-[116px] pt-[75px]">
          <ProfileHeader
            name={display.name}
            region={display.region}
            goal={display.primaryGoal}
            onSettings={() => setUnavailableOpen(true)}
          />

          <ProfileScoreCard score={completionScore} />

          <section className="flex flex-col gap-[30px]">
            <EditableSection
              title="레슨 목적"
              open={openSections.goals}
              onToggle={() => handleToggleSection('goals')}
            >
              <ChipGrid className="px-[30px]">
                {lessonGoalOptions.map((option) => (
                  <ChoiceChip
                    key={option}
                    selected={display.goals.includes(option)}
                    onClick={() => selectGoal(option)}
                  >
                    {option}
                  </ChoiceChip>
                ))}
              </ChipGrid>
            </EditableSection>

            {display.primaryGoal === '입시' ? (
              <EditableSection
                title="전공"
                open={openSections.admission}
                onToggle={() => handleToggleSection('admission')}
              >
                <ChipGrid>
                  {admissionMajorOptions.map((option) => (
                    <ChoiceChip
                      key={option}
                      selected={display.admissionMajor === option}
                      onClick={() => updateStudent({ admissionMajor: option })}
                    >
                      {option}
                    </ChoiceChip>
                  ))}
                </ChipGrid>
              </EditableSection>
            ) : null}

            {display.primaryGoal === '취미' ? (
              <>
                <EditableSection
                  title="선호 장르"
                  subtitle="(최대 2개)"
                  open={openSections.hobby}
                  onToggle={() => handleToggleSection('hobby')}
                >
                  <ChipGrid>
                    {genreOptions.map((option) => (
                      <ChoiceChip
                        key={option}
                        selected={display.genres.includes(option)}
                        onClick={() => selectGenre(option)}
                      >
                        {option}
                      </ChoiceChip>
                    ))}
                  </ChipGrid>
                </EditableSection>

                <EditableSection
                  title="고민 사항"
                  open={openSections.problems}
                  onToggle={() => handleToggleSection('problems')}
                >
                  <SelectDropdown
                    open={problemPickerOpen}
                    value={display.mainProblems[0]}
                    placeholder="여기에서 선택해주세요"
                    options={problemOptions}
                    onToggle={() => setProblemPickerOpen((open) => !open)}
                    onSelect={selectProblem}
                  />
                </EditableSection>
              </>
            ) : null}

            {display.primaryGoal === '축가/행사' ? (
              <EditableSection
                title="행사 정보"
                open={openSections.event}
                onToggle={() => handleToggleSection('event')}
              >
                <div className="flex w-full flex-col gap-3 px-5">
                  <div className="grid grid-cols-3 gap-2">
                    <SelectBox
                      label="연도"
                      value={display.eventYear}
                      options={eventYearOptions}
                      onChange={(value) => updateEventDate('eventYear', value)}
                    />
                    <SelectBox
                      label="월"
                      value={display.eventMonth}
                      options={eventMonthOptions}
                      onChange={(value) => updateEventDate('eventMonth', value)}
                    />
                    <SelectBox
                      label="일"
                      value={display.eventDay}
                      options={eventDayOptions}
                      onChange={(value) => updateStudent({ eventDay: value })}
                    />
                  </div>
                  <TextInput
                    value={display.eventSongName}
                    placeholder="예: 폴킴 - 모든 날, 모든 순간"
                    onChange={(value) => updateStudent({ eventSongName: value })}
                  />
                </div>
              </EditableSection>
            ) : null}

            {display.primaryGoal === '가수 지망 / 오디션' ? (
              <EditableSection
                title="오디션 정보"
                open={openSections.audition}
                onToggle={() => handleToggleSection('audition')}
              >
                <div className="flex w-full flex-col gap-4 px-5">
                  <SelectBox
                    label="출생연도"
                    value={display.birthYear}
                    options={birthYearOptions}
                    onChange={(value) => updateStudent({ birthYear: value })}
                  />
                  <ChipGrid>
                    {auditionDirectionOptions.map((option) => (
                      <ChoiceChip
                        key={option}
                        selected={display.auditionDirection === option}
                        onClick={() => updateStudent({ auditionDirection: option })}
                      >
                        {option}
                      </ChoiceChip>
                    ))}
                  </ChipGrid>
                </div>
              </EditableSection>
            ) : null}

            {display.primaryGoal === '이중에 없어요' ? (
              <EditableSection
                title="원하는 레슨"
                open={openSections.other}
                onToggle={() => handleToggleSection('other')}
              >
                <div className="w-full px-5">
                  <textarea
                    value={display.otherLessonDescription}
                    onChange={(event) =>
                      updateStudent({ otherLessonDescription: event.target.value })
                    }
                    placeholder="원하는 레슨 내용을 짧게 적어주세요."
                    className="h-[140px] w-full resize-none rounded-xl border border-gray-200 bg-white p-[15px] text-sm font-normal leading-normal text-gray-900 outline-none placeholder:text-[#858585]"
                  />
                </div>
              </EditableSection>
            ) : null}

            <EditableSection
              title="소개서"
              open={openSections.intro}
              onToggle={() => handleToggleSection('intro')}
            >
              <div className="w-full px-5">
                <textarea
                  value={display.detail}
                  onChange={(event) =>
                    updateStudent({ mainProblemDetail: event.target.value })
                  }
                  placeholder={
                    "자세히 작성할 수록,\n더 잘 맞는 트레이너와 매칭돼요!\n\nex) 목소리가 쉽게 쉬어서 발성을 점검받고 싶어요. / 제 목표는 '이 곡'이에요. / 주말에만 수업이 가능해요. / 남자/여자 선생님을 원해요."
                  }
                  className="h-[385px] w-full resize-none rounded-xl border border-gray-200 bg-white p-[15px] text-sm font-normal leading-normal text-gray-900 outline-none placeholder:text-[#858585]"
                />
              </div>
            </EditableSection>
          </section>
        </div>

        <BottomTabBar
          active="my"
          onUnavailable={() => setUnavailableOpen(true)}
        />
      </main>

      <UnavailableDialog
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
      />
    </>
  );
}

function ProfileHeader({
  name,
  region,
  goal,
  onSettings,
}: {
  name: string;
  region: string;
  goal: string;
  onSettings: () => void;
}) {
  return (
    <header className="flex w-full items-center justify-between px-5">
      <div className="h-20 w-20 shrink-0 rounded-full bg-gray-200" />
      <div className="flex w-[122px] shrink-0 flex-col gap-[5px]">
        <h1 className="text-lg font-bold leading-none tracking-normal text-black">
          {name} 님
        </h1>
        <p className="text-xs font-medium leading-none tracking-normal text-gray-400">
          {region} · {goal}
        </p>
      </div>
      <button
        type="button"
        onClick={onSettings}
        aria-label="설정"
        className="flex h-8 w-8 items-center justify-center text-gray-950"
      >
        <Settings size={30} strokeWidth={2.5} />
      </button>
    </header>
  );
}

function ProfileScoreCard({ score }: { score: number }) {
  return (
    <section className="flex w-full flex-col items-center">
      <div className="flex h-[95px] w-full items-center justify-center gap-5 rounded-lg border border-gray-100 bg-white">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-200">
          <Image
            src={musicNoteAsset}
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
          />
        </div>
        <div className="flex w-[166px] flex-col justify-center gap-[7px]">
          <div className="flex items-center gap-[5px]">
            <p className="shrink-0 whitespace-nowrap text-[15px] font-bold leading-none tracking-normal text-black">
              프로필 완성도
            </p>
            <span className="flex h-[18px] shrink-0 items-center justify-center rounded-lg bg-blue-200 px-[7px] py-0.5 text-xs font-bold leading-none tracking-normal text-blue-600">
              {score} 점
            </span>
          </div>
          <p className="text-xs font-medium leading-none tracking-normal text-gray-400">
            프로필을 완성하고
            <br />
            맞춤 매칭 받아보기
          </p>
        </div>
      </div>
    </section>
  );
}

function EditableSection({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'flex w-full flex-col items-start bg-white',
        open ? 'gap-4 py-[15px]' : 'py-[5px]'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-[18px] w-full items-center justify-between px-5 text-left"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-[15px] font-bold leading-none tracking-normal text-gray-600">
            {title}
          </span>
          {subtitle ? (
            <span className="text-xs font-medium leading-none tracking-normal text-gray-400">
              {subtitle}
            </span>
          ) : null}
        </span>
        {open ? (
          <ChevronDown size={18} className="text-gray-900" />
        ) : (
          <ChevronUp size={18} className="text-gray-900" />
        )}
      </button>
      {open ? children : null}
    </section>
  );
}

function ChipGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-4',
        className
      )}
    >
      {children}
    </div>
  );
}

function SelectDropdown({
  open,
  value,
  placeholder,
  options,
  onToggle,
  onSelect,
}: {
  open: boolean;
  value?: string;
  placeholder: string;
  options: string[];
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="relative flex w-full flex-col px-5">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex h-12 w-full items-center justify-between border border-gray-200 bg-white px-[15px] text-left text-sm font-normal text-[#858585]',
          open ? 'rounded-t-xl' : 'rounded-xl'
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        {open ? (
          <ChevronUp size={18} className="shrink-0 text-gray-900" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-gray-900" />
        )}
      </button>

      {open ? (
        <div className="overflow-hidden rounded-b-xl border-x border-b border-gray-200 bg-white">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={cn(
                'flex min-h-11 w-full items-center justify-between px-[15px] py-2.5 text-left text-sm font-normal leading-tight',
                value === option ? 'text-blue-700' : 'text-gray-900'
              )}
            >
              <span>{option}</span>
              {value === option ? <Check size={15} strokeWidth={3} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="px-1 text-xs font-medium text-gray-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 text-sm font-normal text-gray-900 outline-none"
      >
        <option value="">선택</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-[15px] text-sm font-normal text-gray-900 outline-none placeholder:text-[#858585]"
    />
  );
}

function ChoiceChip({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[38px] shrink-0 items-center gap-1.5 rounded-full border px-[15px] text-[13px] font-normal leading-[19.5px] tracking-normal',
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
