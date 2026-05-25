import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import ChipGroup from '../../components/ChipGroup';
import { useOnboarding } from '../../context/OnboardingContext';

const OPTIONS = [
  '취미',
  '노래방 실력 향상',
  '발성 교정',
  '고음 문제 해결',
  '입시',
  '오디션',
  '공연 준비',
];

export default function StudentGoals() {
  const navigate = useNavigate();
  const { student, toggleStudentField } = useOnboarding();
  const canNext = student.goals.length > 0;

  return (
    <>
      <TopBar />
      <ProgressBar current={3} total={6} />
      <div className="screen">
        <h1>레슨을 받는 목적이 무엇인가요?</h1>
        <p className="subtitle">중복 선택 가능해요.</p>
        <ChipGroup
          options={OPTIONS}
          selected={student.goals}
          onToggle={(v) => toggleStudentField('goals', v)}
        />
      </div>
      <div className="footer">
        <button
          className="btn btn-primary"
          disabled={!canNext}
          onClick={() => navigate('/student/genres')}
        >
          다음
        </button>
      </div>
    </>
  );
}
