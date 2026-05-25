import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { useStudentActivity } from '../../context/StudentActivityContext';
import { TRAINERS } from '../../mocks/trainers';
import TrainerCard from '../../components/TrainerCard';
import CompareTray from '../../components/CompareTray';

const FILTERS = ['지역', '가격', '목적', '장르', '후기 많은 순'];

function pickHeadline(student: ReturnType<typeof useOnboarding>['student']) {
  const region = student.regions[0];
  const goal = student.goals[0];
  const problem = student.mainProblem;
  if (problem) {
    return `${problem.replace(/요\.?$/, '')}는 분께 맞는 트레이너를 찾았어요`;
  }
  if (region && goal) {
    return `${region} 근처 ${goal} 보컬 트레이너를 추천해드릴게요`;
  }
  if (region) return `${region} 근처 트레이너를 추천해드릴게요`;
  return '나에게 맞는 트레이너를 찾아왔어요';
}

export default function StudentHome() {
  const navigate = useNavigate();
  const { student } = useOnboarding();
  const {
    favoriteTrainerIds,
    recentTrainerIds,
    compareTrainerIds,
    toggleFavorite,
    toggleCompareTrainer,
  } = useStudentActivity();
  const [filter, setFilter] = useState<string | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const trainers = useMemo(() => {
    // light, fake personalization: if region matches, float to top
    const regions = student.regions;
    const tagsWanted = student.goals.concat(student.genres);
    const score = (t: (typeof TRAINERS)[number]) => {
      let s = 0;
      if (regions.some((r) => t.location.includes(r))) s += 5;
      if (tagsWanted.some((g) => t.tags.some((tg) => tg.includes(g) || g.includes(tg)))) s += 2;
      return s;
    };
    const sorted = [...TRAINERS].sort((a, b) => score(b) - score(a));
    if (filter === '후기 많은 순') {
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return sorted;
  }, [filter, student]);

  const headline = pickHeadline(student);
  const hello = student.name ? `${student.name}님` : '안녕하세요';

  return (
    <>
      <div className="app-header">
        <div className="greeting">{hello}, 좋은 하루예요</div>
        <div className="title">
          <em>{headline}</em>
        </div>
        <div className="status-pill">
          <span className="dot" />
          매칭 23명 추천 완료
        </div>
      </div>

      <div className="tab-screen">
        <div className="reason-card">
          <div className="label">추천에 사용된 정보</div>
          <div className="headline">내 조건 요약</div>
          <div className="reason-grid">
            <div className="reason-item">
              <div className="k">레슨 목적</div>
              <div className="v">{student.goals[0] || '미선택'}</div>
            </div>
            <div className="reason-item">
              <div className="k">해결하고 싶은 문제</div>
              <div className="v">{student.mainProblem || '미선택'}</div>
            </div>
            <div className="reason-item">
              <div className="k">희망 지역</div>
              <div className="v">{student.regions.join(', ') || '상관없음'}</div>
            </div>
            <div className="reason-item">
              <div className="k">현재 실력</div>
              <div className="v">{student.skillLevel || '미선택'}</div>
            </div>
          </div>
        </div>

        <div className="filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter((prev) => (prev === f ? null : f))}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section-title">
            <span>나에게 어울리는 트레이너 {trainers.length}명</span>
            <span className="more">전체 보기</span>
          </div>
        </div>

        <div className="trainer-list">
          {trainers.map((t) => (
            <TrainerCard
              key={t.id}
              trainer={t}
              favorite={favoriteTrainerIds.includes(t.id)}
              compareSelected={compareTrainerIds.includes(t.id)}
              onToggleFavorite={() => toggleFavorite(t.id)}
              onToggleCompare={() => toggleCompareTrainer(t.id)}
              onClick={() => navigate(`/app/student/trainers/${t.id}`)}
              onConsult={() => navigate(`/app/student/consult/${t.id}`)}
            />
          ))}
        </div>

        {recentTrainerIds.length > 0 && (
          <div className="section compact-list">
            <div className="section-title">
              <span>최근 본 트레이너</span>
              <span className="more">최신순</span>
            </div>
            {recentTrainerIds
              .map((id) => TRAINERS.find((t) => t.id === id))
              .filter((t): t is (typeof TRAINERS)[number] => Boolean(t))
              .slice(0, 5)
              .map((t) => (
                <button
                  key={t.id}
                  className="simple-trainer-row"
                  onClick={() => navigate(`/app/student/trainers/${t.id}`)}
                >
                  <b>{t.name}</b>
                  <span>{t.location} · {t.price.toLocaleString()}원 · #{t.tags[0]}</span>
                </button>
              ))}
          </div>
        )}
      </div>
      <CompareTray open={compareOpen} onOpenChange={setCompareOpen} />
    </>
  );
}
