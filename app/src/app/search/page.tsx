'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Check,
  ChevronDown,
  Heart,
  Home,
  MapPin,
  Music,
  Settings,
  Tag,
  X,
  type LucideIcon,
} from 'lucide-react';
import { BottomTabBar, TrainerCard } from '@/components/home/home-components';
import { UnavailableDialog } from '@/components/ui/unavailable-dialog';
import { apiTrainerPreviewToUi } from '@/lib/adapters/trainer';
import {
  fetchTrainers,
  type TrainerSearchQuery,
  type TrainerSortOption,
} from '@/lib/api/trainers-client';
import {
  SEOUL_DISTRICTS,
  SEOUL_LOCATIONS,
  type SeoulDistrict,
} from '@/data/seoul-locations';
import { cn } from '@/lib/cn';
import type { ApiTrainerPreview } from '@/types/api';

type SearchFilter = {
  id: string;
  label: string;
  Icon: LucideIcon;
};

type FilterState = {
  district: SeoulDistrict | '';
  neighborhood: string;
  genres: string[];
  goals: string[];
  facilities: string[];
  priceMin: number;
  priceMax: number;
  careerMin: number;
  careerMax: number;
};

const defaultFilterState: FilterState = {
  district: '',
  neighborhood: '',
  genres: [],
  goals: [],
  facilities: [],
  priceMin: 10,
  priceMax: 200,
  careerMin: 0,
  careerMax: 30,
};

/** FilterState → API query. 기본값과 같으면 전송하지 않는다. */
function buildTrainerQuery(
  state: FilterState,
  sort: TrainerSortOption
): TrainerSearchQuery {
  const q: TrainerSearchQuery = { sort };
  if (state.district) q.district = state.district;
  if (state.neighborhood) q.neighborhood = state.neighborhood;
  if (state.genres.length) q.genres = state.genres;
  if (state.goals.length) q.goals = state.goals;
  if (state.facilities.length) q.facilities = state.facilities;
  if (
    state.priceMin !== defaultFilterState.priceMin ||
    state.priceMax !== defaultFilterState.priceMax
  ) {
    q.priceMin = state.priceMin;
    q.priceMax = state.priceMax;
  }
  if (
    state.careerMin !== defaultFilterState.careerMin ||
    state.careerMax !== defaultFilterState.careerMax
  ) {
    q.careerMin = state.careerMin;
    q.careerMax = state.careerMax;
  }
  return q;
}

export default function SearchPage() {
  const [unavailableOpen, setUnavailableOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
  const [sort, setSort] = useState<TrainerSortOption>('recommended');
  const [items, setItems] = useState<ApiTrainerPreview[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('filter') !== 'region') return;

    const district = params.get('district') || '성동구';
    const nextDistrict = district as SeoulDistrict;
    setFilterState((current) => ({ ...current, district: nextDistrict }));
    setFilters([{ id: 'district', label: district, Icon: MapPin }]);
  }, []);

  const query = useMemo(
    () => buildTrainerQuery(filterState, sort),
    [filterState, sort]
  );

  // query 가 바뀔 때마다 재요청. AbortController 로 stale 응답 무시.
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetchTrainers(query, controller.signal)
      .then((response) => {
        setItems(response.items);
        setTotal(response.total);
        setError(null);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'unknown error');
        setItems([]);
        setTotal(0);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [query]);

  const trainers = useMemo(() => items.map(apiTrainerPreviewToUi), [items]);

  return (
    <>
      <main className="relative flex min-h-dvh flex-1 flex-col bg-gray-50">
        <SearchHeader onUnavailable={() => setUnavailableOpen(true)} />

        <section className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-[116px]">
          <FilterSummary
            filters={filters}
            onEdit={() => setFilterOpen(true)}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold leading-none tracking-normal text-[#989898]">
              {isLoading
                ? '검색 중...'
                : `${total}명의 선생님이 추천돼요`}
            </p>
            <label className="relative flex items-center text-sm font-semibold leading-none tracking-normal text-black">
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as TrainerSortOption)
                }
                className="appearance-none bg-transparent pr-5 text-right outline-none"
              >
                <option value="recommended">추천순</option>
                <option value="price">가격순</option>
                <option value="reviews">후기 많은 순</option>
                <option value="career">경력순</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
              />
            </label>
          </div>

          {isLoading && trainers.length === 0 ? (
            <SearchLoadingSkeleton />
          ) : trainers.length === 0 ? (
            <EmptyState hasFilter={filters.length > 0} error={error} />
          ) : (
            <div className="flex flex-col gap-5">
              {trainers.map((trainer) => (
                <TrainerCard
                  key={trainer.id}
                  trainer={trainer}
                  onUnavailable={() => setUnavailableOpen(true)}
                />
              ))}
            </div>
          )}
        </section>

        <BottomTabBar
          active="search"
          onUnavailable={() => setUnavailableOpen(true)}
        />
      </main>
      <UnavailableDialog
        open={unavailableOpen}
        onClose={() => setUnavailableOpen(false)}
      />
      <FilterModal
        open={filterOpen}
        value={filterState}
        onClose={() => setFilterOpen(false)}
        onApply={(next) => {
          setFilterState(next);
          setFilters(buildSearchFilters(next));
          setFilterOpen(false);
        }}
        onReset={() => {
          setFilterState(defaultFilterState);
          setFilters([]);
        }}
      />
    </>
  );
}

function buildSearchFilters(value: FilterState): SearchFilter[] {
  const next: SearchFilter[] = [];
  if (value.district) {
    next.push({
      id: 'district',
      label: value.neighborhood
        ? `${value.district} · ${value.neighborhood}`
        : value.district,
      Icon: MapPin,
    });
  }
  value.genres.forEach((genre) =>
    next.push({ id: `genre-${genre}`, label: genre, Icon: Music })
  );
  value.goals.forEach((goal) =>
    next.push({ id: `goal-${goal}`, label: goal, Icon: Heart })
  );
  value.facilities.forEach((facility) =>
    next.push({ id: `facility-${facility}`, label: facility, Icon: Home })
  );
  if (value.priceMin !== 10 || value.priceMax !== 200) {
    next.push({
      id: 'price',
      label: `${value.priceMin}~${value.priceMax}만`,
      Icon: Tag,
    });
  }
  if (value.careerMin !== 0 || value.careerMax !== 30) {
    next.push({
      id: 'career',
      label: `${value.careerMin}~${value.careerMax}년`,
      Icon: Award,
    });
  }
  return next;
}

function SearchLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[188px] w-full animate-pulse rounded-lg border border-[#b3b1b1] bg-gray-100"
        />
      ))}
    </div>
  );
}

function EmptyState({
  hasFilter,
  error,
}: {
  hasFilter: boolean;
  error: string | null;
}) {
  return (
    <div className="flex flex-1 items-center justify-center pb-20 text-center text-sm leading-tight tracking-normal text-[#a6a6a6]">
      {error ? (
        <p>
          데이터를 불러오지 못했어요.
          <br />
          잠시 후 다시 시도해주세요.
        </p>
      ) : hasFilter ? (
        <p>
          조건에 맞는 선생님이 없어요.
          <br />
          다른 필터로 시도해보세요!
        </p>
      ) : (
        <p>
          아직 검색된 선생님이 없어요.
          <br />
          필터를 이용해 검색해보세요!
        </p>
      )}
    </div>
  );
}

function SearchHeader({ onUnavailable }: { onUnavailable: () => void }) {
  return (
    <header className="flex h-[129px] w-full shrink-0 items-end justify-between bg-gray-50 px-5 pb-[15px] pt-[75px]">
      <h1 className="text-[32px] font-bold leading-none tracking-normal text-black">
        탐색
      </h1>
      <button
        type="button"
        onClick={onUnavailable}
        aria-label="설정"
        className="flex h-8 w-8 items-center justify-center text-gray-950"
      >
        <Settings size={30} strokeWidth={2.5} />
      </button>
    </header>
  );
}

function FilterSummary({
  filters,
  onEdit,
}: {
  filters: SearchFilter[];
  onEdit: () => void;
}) {
  return (
    <div className="rounded-lg bg-[#035ef3] px-[15px] py-2.5 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white bg-white">
            {filters.length > 0 ? (
              <Check size={12} strokeWidth={3} className="text-[#035ef3]" />
            ) : null}
          </span>
          <span className="text-xs font-medium tracking-normal">
            선택된 필터 {filters.length}개
          </span>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-[22px] items-center justify-center rounded border border-white px-2 text-[10px] font-medium"
        >
          필터 수정
        </button>
      </div>

      {filters.length > 0 ? (
        <div className="-mx-1 mt-2.5 flex gap-6 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map(({ id, label, Icon }) => (
            <div
              key={id}
              className="flex shrink-0 flex-col items-center justify-center gap-1 text-center"
            >
              <Icon size={16} strokeWidth={2} />
              <span className="whitespace-nowrap text-[10px] font-medium leading-[19.5px]">
                {label}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const genreOptions = [
  '발라드',
  'R&B',
  '락/밴드',
  '팝송',
  '인디',
  'KPOP/아이돌',
  '뮤지컬',
];

const goalOptions = ['입시', '취미', '축가/행사', '오디션', '녹음/커버'];

const facilityOptions = ['연습실', '작업실', '레코딩룸', '주차공간'];

function FilterModal({
  open,
  value,
  onClose,
  onApply,
  onReset,
}: {
  open: boolean;
  value: FilterState;
  onClose: () => void;
  onApply: (value: FilterState) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState(value);
  const [previewTotal, setPreviewTotal] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  // 모달 안에서 드래프트가 바뀔 때 결과 개수를 API 로 미리 본다. 350ms 디바운스.
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const handle = window.setTimeout(() => {
      setPreviewLoading(true);
      fetchTrainers(buildTrainerQuery(draft, 'recommended'), controller.signal)
        .then((response) => setPreviewTotal(response.total))
        .catch(() => setPreviewTotal(null))
        .finally(() => {
          if (!controller.signal.aborted) setPreviewLoading(false);
        });
    }, 350);
    return () => {
      controller.abort();
      window.clearTimeout(handle);
    };
  }, [draft, open]);

  if (!open) return null;

  const neighborhoodOptions = draft.district
    ? SEOUL_LOCATIONS[draft.district]
    : [];

  const toggleArray = (
    key: 'genres' | 'goals' | 'facilities',
    item: string
  ) => {
    setDraft((current) => {
      const list = current[key];
      return {
        ...current,
        [key]: list.includes(item)
          ? list.filter((value) => value !== item)
          : [...list, item],
      };
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/45">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
        className="flex max-h-[86dvh] w-full max-w-phone flex-col overflow-hidden rounded-t-xl bg-white"
      >
        <header className="flex h-[62px] shrink-0 items-center justify-between border-b border-gray-100 px-5">
          <h2
            id="filter-modal-title"
            className="text-xl font-bold leading-none tracking-normal text-black"
          >
            필터
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center text-gray-950"
          >
            <X size={22} />
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-[30px] overflow-y-auto px-5 py-5">
          <FilterBlock title="지역">
            <div className="grid grid-cols-2 gap-2.5">
              <SelectShell>
                <select
                  value={draft.district}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      district: event.target.value as SeoulDistrict | '',
                      neighborhood: '',
                    }))
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-[15px] pr-10 text-sm font-medium text-gray-900 outline-none"
                >
                  <option value="">시군구</option>
                  {SEOUL_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </SelectShell>
              <SelectShell disabled={!draft.district}>
                <select
                  value={draft.neighborhood}
                  disabled={!draft.district}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      neighborhood: event.target.value,
                    }))
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-[15px] pr-10 text-sm font-medium text-gray-900 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">읍면동</option>
                  {neighborhoodOptions.map((neighborhood) => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </option>
                  ))}
                </select>
              </SelectShell>
            </div>
          </FilterBlock>

          <FilterBlock title="장르">
            <OptionGrid>
              {genreOptions.map((option) => (
                <FilterChip
                  key={option}
                  selected={draft.genres.includes(option)}
                  onClick={() => toggleArray('genres', option)}
                >
                  {option}
                </FilterChip>
              ))}
            </OptionGrid>
          </FilterBlock>

          <FilterBlock title="목적">
            <OptionGrid>
              {goalOptions.map((option) => (
                <FilterChip
                  key={option}
                  selected={draft.goals.includes(option)}
                  onClick={() => toggleArray('goals', option)}
                >
                  {option}
                </FilterChip>
              ))}
            </OptionGrid>
          </FilterBlock>

          <FilterBlock title="시설">
            <OptionGrid>
              {facilityOptions.map((option) => (
                <FilterChip
                  key={option}
                  selected={draft.facilities.includes(option)}
                  onClick={() => toggleArray('facilities', option)}
                >
                  {option}
                </FilterChip>
              ))}
            </OptionGrid>
          </FilterBlock>

          <FilterBlock
            title="가격대"
            rightSlot={`${draft.priceMin}만원 ~ ${draft.priceMax}만원`}
          >
            <RangePair
              min={10}
              max={200}
              step={10}
              minValue={draft.priceMin}
              maxValue={draft.priceMax}
              onChange={(priceMin, priceMax) =>
                setDraft((current) => ({ ...current, priceMin, priceMax }))
              }
            />
          </FilterBlock>

          <FilterBlock
            title="경력"
            rightSlot={`${draft.careerMin}년 ~ ${draft.careerMax}년`}
          >
            <RangePair
              min={0}
              max={30}
              step={1}
              minValue={draft.careerMin}
              maxValue={draft.careerMax}
              onChange={(careerMin, careerMax) =>
                setDraft((current) => ({ ...current, careerMin, careerMax }))
              }
            />
          </FilterBlock>
        </div>

        <footer className="flex shrink-0 gap-2.5 border-t border-gray-100 bg-white px-5 py-4">
          <button
            type="button"
            onClick={() => {
              setDraft(defaultFilterState);
              onReset();
            }}
            className="h-12 w-[104px] rounded-lg border border-gray-200 text-sm font-semibold text-gray-600"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="h-12 min-w-0 flex-1 rounded-lg bg-[#035ef3] text-sm font-bold text-white"
          >
            {previewLoading || previewTotal === null
              ? '결과 보기'
              : `${previewTotal}개 결과 보기`}
          </button>
        </footer>
      </section>
    </div>
  );
}

function SelectShell({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="relative min-w-0">
      {children}
      <ChevronDown
        size={16}
        className={cn(
          'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2',
          disabled ? 'text-gray-400' : 'text-gray-600'
        )}
      />
    </div>
  );
}

function FilterBlock({
  title,
  rightSlot,
  children,
}: {
  title: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold leading-none tracking-normal text-gray-600">
          {title}
        </h3>
        {rightSlot ? (
          <span className="text-xs font-medium leading-none tracking-normal text-gray-400">
            {rightSlot}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function OptionGrid({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2.5">{children}</div>;
}

function FilterChip({
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
        'flex h-[38px] items-center rounded-full border px-[15px] text-[13px] font-normal leading-[19.5px]',
        selected
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 bg-white text-gray-900'
      )}
    >
      {children}
    </button>
  );
}

function RangePair({
  min,
  max,
  step,
  minValue,
  maxValue,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  minValue: number;
  maxValue: number;
  onChange: (minValue: number, maxValue: number) => void;
}) {
  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;
  const minThumbLimit = Math.min(minValue, maxValue - step);
  const maxThumbLimit = Math.max(maxValue, minValue + step);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-8">
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-200" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#035ef3]"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        <input
          aria-label="최소값"
          type="range"
          min={min}
          max={max}
          step={step}
          value={minThumbLimit}
          onChange={(event) => {
            const next = Math.min(Number(event.target.value), maxValue - step);
            onChange(next, maxValue);
          }}
          className="range-thumb pointer-events-none absolute inset-x-0 top-1/2 z-20 h-8 w-full -translate-y-1/2 appearance-none bg-transparent"
        />
        <input
          aria-label="최대값"
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxThumbLimit}
          onChange={(event) => {
            const next = Math.max(Number(event.target.value), minValue + step);
            onChange(minValue, next);
          }}
          className="range-thumb pointer-events-none absolute inset-x-0 top-1/2 z-30 h-8 w-full -translate-y-1/2 appearance-none bg-transparent"
        />
      </div>
      <div className="flex justify-between text-[11px] font-medium leading-none text-gray-400">
        <span>{min}</span>
        <span className="text-[#035ef3]">
          {minValue} ~ {maxValue}
        </span>
        <span>{max}</span>
      </div>
    </div>
  );
}
