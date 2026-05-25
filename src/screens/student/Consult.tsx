import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { TRAINERS } from '../../mocks/trainers';
import { useOnboarding, StudentData } from '../../context/OnboardingContext';
import { useConsult, StudentSummary } from '../../context/ConsultContext';

function buildFirstMessage(s: StudentData) {
  const lines: string[] = ['안녕하세요.'];
  if (s.mainProblem) {
    const trimmed = s.mainProblem.replace(/[.?!]?\s*$/, '').replace(/요$/, '');
    lines.push(`${trimmed}서 상담 받고 싶어요.`);
  } else if (s.goals[0]) {
    lines.push(`${s.goals[0]} 관련해서 상담 받고 싶어요.`);
  } else {
    lines.push('레슨 상담 받고 싶어요.');
  }
  const conditions: string[] = [];
  if (s.goals[0]) conditions.push(`${s.goals[0]}(으)로 배우고 싶고`);
  if (s.regions[0] && s.regions[0] !== '상관없음') {
    conditions.push(`${s.regions[0]} 근처 수업을 찾고 있`);
  }
  if (conditions.length) lines.push(conditions.join(', ') + '습니다.');
  if (s.mainProblemDetail) lines.push(`(${s.mainProblemDetail})`);
  return lines.join(' ');
}

export default function Consult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student } = useOnboarding();
  const { startConsultation, getByTrainerForMe } = useConsult();
  const trainer = TRAINERS.find((t) => t.id === id);

  const initialMessage = useMemo(() => buildFirstMessage(student), [student]);
  const [draft, setDraft] = useState(initialMessage);

  if (!trainer) {
    return (
      <>
        <TopBar />
        <div className="screen">
          <h1>트레이너를 찾을 수 없어요</h1>
        </div>
      </>
    );
  }

  const existing = getByTrainerForMe(trainer.id);

  const start = () => {
    const summary: StudentSummary = {
      name: student.name || '회원',
      goals: student.goals,
      mainProblem: student.mainProblem,
      mainProblemDetail: student.mainProblemDetail,
      genres: student.genres,
      regions: student.regions,
      skillLevel: student.skillLevel,
    };
    const consultId = startConsultation({
      trainerId: trainer.id,
      trainerName: trainer.name,
      firstMessage: draft.trim() || '안녕하세요. 상담 받고 싶어요.',
      studentName: student.name || '회원',
      studentSummary: summary,
    });
    navigate(`/app/student/chat/${consultId}`, { replace: true });
  };

  return (
    <>
      <TopBar title="상담 시작" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 100px' }} className="consult-start">
        {/* 강사 정보 */}
        <div className="trainer-pill">
          <div
            className="avatar"
            style={{
              background: `linear-gradient(135deg, ${trainer.gradient[0]}, ${trainer.gradient[1]})`,
            }}
          >
            {trainer.initial}
          </div>
          <div className="info">
            <div className="name">{trainer.name} 트레이너</div>
            <div className="tags">
              {trainer.tags.slice(0, 3).map((t) => `#${t}`).join(' ')} · {trainer.location}
            </div>
          </div>
        </div>

        {existing && (
          <div
            style={{
              padding: 12,
              background: '#fef3c7',
              color: '#92651b',
              borderRadius: 12,
              fontSize: 13,
              marginBottom: 12,
              lineHeight: 1.5,
            }}
          >
            이미 이 트레이너와 상담 중이에요. 시작하면 기존 채팅방으로 이동합니다.
          </div>
        )}

        {/* 내 정보 요약 */}
        <div style={{ fontSize: 13, fontWeight: 700, margin: '8px 0 8px' }}>
          내 정보 (강사에게 전달돼요)
        </div>
        <div className="summary-card">
          <div className="summary-row">
            <span className="k">레슨 목적</span>
            <span className="v">{student.goals.join(', ') || '-'}</span>
          </div>
          <div className="summary-row">
            <span className="k">현재 고민</span>
            <span className="v">{student.mainProblem || '-'}</span>
          </div>
          <div className="summary-row">
            <span className="k">선호 장르</span>
            <span className="v">{student.genres.join(', ') || '-'}</span>
          </div>
          <div className="summary-row">
            <span className="k">희망 지역</span>
            <span className="v">{student.regions.join(', ') || '-'}</span>
          </div>
          <div className="summary-row">
            <span className="k">현재 실력</span>
            <span className="v">{student.skillLevel || '-'}</span>
          </div>
        </div>

        {/* 첫 메시지 */}
        <div style={{ fontSize: 13, fontWeight: 700, margin: '16px 0 8px' }}>
          첫 메시지 미리보기
        </div>
        <div className="draft">
          <div className="label">필요하면 수정해도 좋아요.</div>
          <textarea
            className="draft-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="강사에게 보낼 첫 메시지"
          />
        </div>
      </div>

      <div className="cta-fixed">
        <button className="btn btn-primary" onClick={start}>
          {existing ? '채팅방으로 이동' : '상담 시작하기'}
        </button>
      </div>
    </>
  );
}
