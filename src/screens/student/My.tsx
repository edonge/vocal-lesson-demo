import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime, STATUS_LABEL, useConsult } from '../../context/ConsultContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { useStudentActivity } from '../../context/StudentActivityContext';
import { TRAINERS, Trainer } from '../../mocks/trainers';

function TrainerMiniList({ trainers, empty }: { trainers: Trainer[]; empty: string }) {
  const navigate = useNavigate();
  if (trainers.length === 0) {
    return <div className="empty-note">{empty}</div>;
  }
  return (
    <div className="mini-trainer-list">
      {trainers.map((t) => (
        <button key={t.id} className="simple-trainer-row" onClick={() => navigate(`/app/student/trainers/${t.id}`)}>
          <b>{t.name}</b>
          <span>{t.location} · {t.price.toLocaleString()}원 · #{t.tags[0]}</span>
        </button>
      ))}
    </div>
  );
}

export default function StudentMy() {
  const navigate = useNavigate();
  const { student, reset } = useOnboarding();
  const { consultations } = useConsult();
  const { favoriteTrainerIds, recentTrainerIds } = useStudentActivity();
  const initial = student.name?.[0] || 'V';
  const lessonSummary = [
    student.goals[0] || '취미 보컬',
    student.mainProblem || '고민 미설정',
    student.regions[0] ? `${student.regions[0]} 선호` : '지역 무관',
  ].join(' · ');

  const mine = useMemo(
    () =>
      consultations
        .filter((c) => c.studentId === 'me')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [consultations]
  );

  const favorites = favoriteTrainerIds
    .map((id) => TRAINERS.find((t) => t.id === id))
    .filter((t): t is Trainer => Boolean(t));
  const recent = recentTrainerIds
    .map((id) => TRAINERS.find((t) => t.id === id))
    .filter((t): t is Trainer => Boolean(t));

  return (
    <>
      <div className="app-header">
        <div className="greeting">마이</div>
        <div className="title">{student.name || '회원'}님의 레슨 조건</div>
      </div>

      <div className="tab-screen">
        <div className="dash-card" style={{ marginTop: 14 }}>
          <div className="mini-profile">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #0b67ff, #0a52cc)' }}>
              {initial}
            </div>
            <div className="info">
              <div className="name">{student.name || '회원'}님</div>
              <div className="meta">{lessonSummary}</div>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <h3>
            내 레슨 조건
            <small>조건 수정하기</small>
          </h3>
          <div className="summary-row">
            <span className="k">목적</span>
            <span className="v">{student.goals.join(', ') || '미설정'}</span>
          </div>
          <div className="summary-row">
            <span className="k">고민</span>
            <span className="v">{student.mainProblem || '미설정'}</span>
          </div>
          <div className="summary-row">
            <span className="k">장르</span>
            <span className="v">{student.genres.join(', ') || '미설정'}</span>
          </div>
          <div className="summary-row">
            <span className="k">지역</span>
            <span className="v">{student.regions.join(', ') || '상관없음'}</span>
          </div>
          <div className="summary-row">
            <span className="k">예산</span>
            <span className="v">5~7만 원 선호</span>
          </div>
          <div className="summary-row">
            <span className="k">강사 스타일</span>
            <span className="v">친절한 설명 · 정확한 피드백</span>
          </div>
        </div>

        <div className="dash-card">
          <h3>상담 중인 강사</h3>
          {mine.length === 0 ? (
            <div className="empty-note">아직 상담 중인 선생님이 없어요</div>
          ) : (
            mine.slice(0, 3).map((c) => (
              <button key={c.id} className="consult-mini-row" onClick={() => navigate(`/app/student/chat/${c.id}`)}>
                <b>{c.trainerName}</b>
                <span>{STATUS_LABEL[c.status]} · {formatRelativeTime(c.updatedAt)}</span>
                {c.unread.student > 0 && <em>{c.unread.student}</em>}
              </button>
            ))
          )}
        </div>

        <div className="dash-card">
          <h3>찜한 강사</h3>
          <TrainerMiniList
            trainers={favorites}
            empty="아직 찜한 트레이너가 없어요. 마음에 드는 선생님을 저장해두고 비교해보세요."
          />
        </div>

        <div className="dash-card">
          <h3>최근 본 강사</h3>
          <TrainerMiniList trainers={recent} empty="최근 본 트레이너가 아직 없어요." />
        </div>

        <div className="my-list">
          {['알림 설정', '고객센터', '약관', '로그아웃'].map((label) => (
            <button
              key={label}
              className="item"
              onClick={() => {
                if (label === '로그아웃') {
                  reset();
                  navigate('/');
                }
              }}
            >
              <span className="ic">{label === '알림 설정' ? '🔔' : label === '고객센터' ? '🛟' : label === '약관' ? '📄' : '↩'}</span>
              <span>{label}</span>
              <span className="chev">›</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
