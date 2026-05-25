import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';

const GENDERS = ['남성', '여성', '선택 안 함'];
const CURRENT_YEAR = new Date().getFullYear();

export default function StudentBasic() {
  const navigate = useNavigate();
  const { student, updateStudent } = useOnboarding();

  const year = Number(student.birthYear);
  const yearValid =
    student.birthYear.length === 4 &&
    !Number.isNaN(year) &&
    year >= 1940 &&
    year <= CURRENT_YEAR;

  const canNext =
    student.name.trim().length > 0 && !!student.gender && yearValid;

  return (
    <>
      <TopBar />
      <ProgressBar current={1} total={6} />
      <div className="screen">
        <h1>먼저 본인 소개를 부탁드려요</h1>
        <p className="subtitle">강사 추천과 매칭에 사용되는 기본 정보예요.</p>

        <div className="field">
          <label className="label">이름</label>
          <input
            className="input"
            placeholder="이름을 입력하세요"
            value={student.name}
            onChange={(e) => updateStudent({ name: e.target.value })}
          />
        </div>

        <div className="field">
          <label className="label">성별</label>
          <div className="chips">
            {GENDERS.map((g) => (
              <button
                key={g}
                type="button"
                className={`chip ${student.gender === g ? 'selected' : ''}`}
                onClick={() => updateStudent({ gender: g })}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="label">출생년도</label>
          <input
            className="input"
            inputMode="numeric"
            maxLength={4}
            placeholder="예) 2002"
            value={student.birthYear}
            onChange={(e) =>
              updateStudent({ birthYear: e.target.value.replace(/[^0-9]/g, '').slice(0, 4) })
            }
          />
          <div className="hint">
            {student.birthYear && !yearValid
              ? '1940년 이후의 4자리 연도를 입력해주세요'
              : '연도 4자리만 입력해주세요'}
          </div>
        </div>
      </div>

      <div className="footer">
        <button
          className="btn btn-primary"
          disabled={!canNext}
          onClick={() => navigate('/student/region')}
        >
          다음
        </button>
      </div>
    </>
  );
}
