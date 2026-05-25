import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompareTray from '../../components/CompareTray';
import TrainerCard from '../../components/TrainerCard';
import { useOnboarding } from '../../context/OnboardingContext';
import { useStudentActivity } from '../../context/StudentActivityContext';
import { TRAINERS, Trainer } from '../../mocks/trainers';

type SortKey = 'recommend' | 'reviews' | 'rating' | 'price' | 'active';

const REGIONS = ['홍대', '합정', '강남', '신촌', '성수', '잠실', '온라인'];
const PURPOSES = ['취미', '입시', '오디션', '직장인', '완전 초보'];
const PROBLEMS = ['고음', '발성', '음정', '감정 표현', '녹음'];
const GENRES = ['발라드', 'K-pop', 'R&B', '락/밴드', '뮤지컬', '팝송'];
const BUDGETS = ['~5만 원', '5~7만 원', '7만 원 이상'];
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'recommend', label: '추천순' },
  { key: 'reviews', label: '후기 많은 순' },
  { key: 'rating', label: '평점 높은 순' },
  { key: 'price', label: '가격 낮은 순' },
  { key: 'active', label: '최근 활동순' },
];

function includesAny(source: string[], values: string[]) {
  if (values.length === 0) return true;
  const hay = source.join(' ');
  return values.some((v) => hay.includes(v) || source.some((s) => v.includes(s)));
}

function budgetMatches(t: Trainer, budget: string | null) {
  if (!budget) return true;
  if (budget === '~5만 원') return t.price <= 50000;
  if (budget === '5~7만 원') return t.price >= 50000 && t.price <= 70000;
  return t.price >= 70000;
}

function online(t: Trainer) {
  return t.location.includes('온라인') || t.lessonMethods.some((m) => m.includes('온라인'));
}

function score(t: Trainer, wanted: string[]) {
  let s = 0;
  if (includesAny([t.location], wanted)) s += 5;
  if (includesAny(t.tags, wanted)) s += 4;
  if (includesAny(t.target, wanted)) s += 2;
  if (t.priceVisibility === 'public') s += 1;
  return s;
}

export default function StudentExplore() {
  const navigate = useNavigate();
  const { student } = useOnboarding();
  const {
    favoriteTrainerIds,
    compareTrainerIds,
    toggleFavorite,
    toggleCompareTrainer,
  } = useStudentActivity();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<string | null>(student.regions[0] || null);
  const [purpose, setPurpose] = useState<string | null>(student.goals[0] || null);
  const [problem, setProblem] = useState<string | null>(student.mainProblem?.replace(/이 안 올라가요|이 불안해요|이 어려워요/g, '') || null);
  const [genre, setGenre] = useState<string | null>(student.genres[0] || null);
  const [budget, setBudget] = useState<string | null>(null);
  const [lessonMode, setLessonMode] = useState<string | null>(null);
  const [pricePublicOnly, setPricePublicOnly] = useState(false);
  const [trialOnly, setTrialOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('recommend');
  const [moreOpen, setMoreOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const selectedWords = [region, purpose, problem, genre].filter(Boolean) as string[];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const wanted = selectedWords.concat(q ? [q] : []);
    const list = TRAINERS.filter((t) => {
      const fields = [
        t.name,
        t.location,
        t.intro,
        ...t.tags,
        ...t.target,
        ...t.lessonMethods,
        ...t.recommendedFor,
      ].join(' ').toLowerCase();
      if (q && !fields.includes(q)) return false;
      if (region && !t.location.includes(region)) return false;
      if (purpose && !includesAny(t.target.concat(t.tags), [purpose])) return false;
      if (problem && !includesAny(t.tags.concat(t.recommendedFor), [problem])) return false;
      if (genre && !includesAny(t.tags.concat(t.intro), [genre])) return false;
      if (!budgetMatches(t, budget)) return false;
      if (lessonMode === '온라인' && !online(t)) return false;
      if (lessonMode === '대면' && t.location.includes('온라인')) return false;
      if (pricePublicOnly && t.priceVisibility !== 'public') return false;
      if (trialOnly && t.trialPrice <= 0) return false;
      if (onlineOnly && !online(t)) return false;
      return true;
    });

    return list.sort((a, b) => {
      if (sort === 'reviews') return b.reviewCount - a.reviewCount;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'price') return a.price - b.price;
      if (sort === 'active') return b.experienceYears - a.experienceYears;
      return score(b, wanted) - score(a, wanted);
    });
  }, [budget, genre, lessonMode, onlineOnly, pricePublicOnly, problem, query, region, selectedWords, sort, trialOnly]);

  const summary = selectedWords.length
    ? `${selectedWords.join(' · ')} 조건에 맞는 트레이너`
    : '지역, 장르, 고민으로 트레이너를 찾아보세요';

  return (
    <>
      <div className="app-header">
        <div className="greeting">탐색</div>
        <div className="title">조건을 바꿔가며 비교해보세요</div>
      </div>
      <div className="tab-screen">
        <div className="explore-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="지역, 장르, 고민으로 검색해보세요"
          />
          <p>{summary}</p>
        </div>

        <div className="filter-bar">
          {REGIONS.map((x) => (
            <button key={x} className={`filter-chip ${region === x ? 'active' : ''}`} onClick={() => setRegion(region === x ? null : x)}>
              {x}
            </button>
          ))}
        </div>
        <div className="filter-bar" style={{ paddingTop: 0 }}>
          {PURPOSES.map((x) => (
            <button key={x} className={`filter-chip ${purpose === x ? 'active' : ''}`} onClick={() => setPurpose(purpose === x ? null : x)}>
              {x}
            </button>
          ))}
          <button className={`filter-chip ${moreOpen ? 'active' : ''}`} onClick={() => setMoreOpen((v) => !v)}>
            상세 필터
          </button>
        </div>

        {moreOpen && (
          <div className="detail-filter-panel">
            <div className="filter-group">
              <b>고민/전문 분야</b>
              <div className="chips-inline">
                {PROBLEMS.map((x) => (
                  <button key={x} className={`filter-chip ${problem === x ? 'active' : ''}`} onClick={() => setProblem(problem === x ? null : x)}>
                    {x}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <b>장르</b>
              <div className="chips-inline">
                {GENRES.map((x) => (
                  <button key={x} className={`filter-chip ${genre === x ? 'active' : ''}`} onClick={() => setGenre(genre === x ? null : x)}>
                    {x}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <b>예산/수업 방식</b>
              <div className="chips-inline">
                {BUDGETS.map((x) => (
                  <button key={x} className={`filter-chip ${budget === x ? 'active' : ''}`} onClick={() => setBudget(budget === x ? null : x)}>
                    {x}
                  </button>
                ))}
                {['대면', '온라인'].map((x) => (
                  <button key={x} className={`filter-chip ${lessonMode === x ? 'active' : ''}`} onClick={() => setLessonMode(lessonMode === x ? null : x)}>
                    {x}
                  </button>
                ))}
              </div>
            </div>
            <div className="toggle-row">
              <button className={pricePublicOnly ? 'on' : ''} onClick={() => setPricePublicOnly((v) => !v)}>가격 공개</button>
              <button className={trialOnly ? 'on' : ''} onClick={() => setTrialOnly((v) => !v)}>체험 수업 가능</button>
              <button className={onlineOnly ? 'on' : ''} onClick={() => setOnlineOnly((v) => !v)}>온라인 가능</button>
            </div>
          </div>
        )}

        <div className="filter-bar" style={{ paddingTop: 0 }}>
          {SORTS.map((x) => (
            <button key={x.key} className={`filter-chip ${sort === x.key ? 'active' : ''}`} onClick={() => setSort(x.key)}>
              {x.label}
            </button>
          ))}
        </div>

        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section-title">
            <span>조건에 맞는 트레이너 {filtered.length}명</span>
            <span className="more">{pricePublicOnly ? '가격 공개만' : '전체 가격'}</span>
          </div>
        </div>

        <div className="trainer-list">
          {filtered.map((t) => (
            <TrainerCard
              key={t.id}
              trainer={t}
              favorite={favoriteTrainerIds.includes(t.id)}
              compareSelected={compareTrainerIds.includes(t.id)}
              onToggleFavorite={() => toggleFavorite(t.id)}
              onToggleCompare={() => toggleCompareTrainer(t.id)}
              onClick={() => navigate(`/app/student/trainers/${t.id}`)}
              onConsult={() => navigate(`/app/student/consult/${t.id}`)}
              reason={region && t.location.includes(region) ? `${region} 근처 조건에 맞아요` : undefined}
            />
          ))}
        </div>
      </div>
      <CompareTray open={compareOpen} onOpenChange={setCompareOpen} />
    </>
  );
}
