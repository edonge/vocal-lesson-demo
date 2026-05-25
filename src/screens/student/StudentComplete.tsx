import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { useOnboarding } from '../../context/OnboardingContext';

function fmt(arr: string[]) {
  return arr.length ? arr.join(', ') : '-';
}

export default function StudentComplete() {
  const navigate = useNavigate();
  const { student } = useOnboarding();

  const ageHint = (() => {
    const y = Number(student.birthYear);
    if (!y) return '-';
    const age = new Date().getFullYear() - y + 1; // 한국 나이 근사
    return `${student.birthYear}년생 · 만 ${new Date().getFullYear() - y}세`;
  })();

  return (
    <>
      <TopBar hideBack />
      <div className="screen">
        <div className="celebrate">
          <div className="badge">🎯</div>
          <h1>조건에 맞는 트레이너를 찾았어요</h1>
          <p>
            {student.name ? `${student.name}님께` : '회원님께'} 어울리는 강사 23명을 추렸어요.
          </p>
        </div>

        <div className="summary-card" style={{ marginTop: 16 }}>
          <div className="summary-row">
            <span className="k">이름</span>
            <span className="v">{student.name || '-'}</span>
          </div>
          <div className="summary-row">
            <span className="k">성별</span>
            <span className="v">{student.gender || '-'}</span>
          </div>
          <div className="summary-row">
            <span className="k">출생년도</span>
            <span className="v">{ageHint}</span>
          </div>
          <div className="summary-row">
            <span className="k">지역 / 방식</span>
            <span className="v">{fmt(student.regions)}</span>
          </div>
          <div className="summary-row">
            <span className="k">레슨 목적</span>
            <span className="v">{fmt(student.goals)}</span>
          </div>
          <div className="summary-row">
            <span className="k">선호 장르</span>
            <span className="v">{fmt(student.genres)}</span>
          </div>
          <div className="summary-row">
            <span className="k">현재 실력</span>
            <span className="v">{student.skillLevel || '-'}</span>
          </div>
          <div className="summary-row">
            <span className="k">해결하고 싶은 문제</span>
            <span className="v">
              {student.mainProblem || '-'}
              {student.mainProblemDetail && (
                <>
                  <br />
                  <span style={{ color: 'var(--gray-500)', fontWeight: 400, fontSize: 13 }}>
                    "{student.mainProblemDetail}"
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="footer">
        <button className="btn btn-primary" onClick={() => navigate('/app/student/home')}>
          추천 강사 보러가기
        </button>
      </div>
    </>
  );
}
