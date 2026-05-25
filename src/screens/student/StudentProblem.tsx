import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';

const PROBLEMS = [
  '고음이 안 올라가요',
  '음정이 불안해요',
  '박자가 어려워요',
  '목이 빨리 쉬어요',
  '호흡이 짧아요',
  '감정 표현이 어려워요',
  '뭘 고쳐야 할지 모르겠어요',
];

export default function StudentProblem() {
  const navigate = useNavigate();
  const { student, updateStudent } = useOnboarding();
  const canNext = !!student.mainProblem;

  return (
    <>
      <TopBar />
      <ProgressBar current={6} total={6} />
      <div className="screen">
        <h1>
          가장 해결하고 싶은
          <br />
          문제는 무엇인가요?
        </h1>
        <p className="subtitle">하나만 골라주세요. 강사가 가장 먼저 확인하는 항목이에요.</p>

        <div className="options">
          {PROBLEMS.map((p) => (
            <button
              key={p}
              type="button"
              className={`option ${student.mainProblem === p ? 'selected' : ''}`}
              onClick={() => updateStudent({ mainProblem: p })}
            >
              <div className="icon">🎯</div>
              <div>
                <div className="title">{p}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label className="label">조금 더 자세히 알려주세요 (선택)</label>
          <textarea
            className="textarea"
            placeholder="예) 노래방에서 2옥타브 라 이상이 안 올라가요"
            maxLength={120}
            value={student.mainProblemDetail}
            onChange={(e) => updateStudent({ mainProblemDetail: e.target.value })}
          />
          <div className="hint" style={{ textAlign: 'right' }}>
            {student.mainProblemDetail.length} / 120
          </div>
        </div>
      </div>
      <div className="footer">
        <button
          className="btn btn-primary"
          disabled={!canNext}
          onClick={() => navigate('/student/complete')}
        >
          완료
        </button>
      </div>
    </>
  );
}
