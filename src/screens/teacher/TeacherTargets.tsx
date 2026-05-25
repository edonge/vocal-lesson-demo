import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import ChipGroup from '../../components/ChipGroup';
import { useOnboarding } from '../../context/OnboardingContext';

const OPTIONS = ['취미', '입시', '오디션', '직장인', '밴드 보컬', '완전 초보'];

export default function TeacherTargets() {
  const navigate = useNavigate();
  const { teacher, toggleTeacherField } = useOnboarding();
  const canNext = teacher.targets.length > 0;
  return (
    <>
      <TopBar />
      <ProgressBar current={3} total={6} />
      <div className="screen">
        <h1>어떤 수강생을 가르치시나요?</h1>
        <p className="subtitle">레슨 대상을 모두 선택해주세요.</p>
        <ChipGroup
          options={OPTIONS}
          selected={teacher.targets}
          onToggle={(v) => toggleTeacherField('targets', v)}
        />
      </div>
      <div className="footer">
        <button className="btn btn-primary" disabled={!canNext} onClick={() => navigate('/teacher/specialties')}>
          다음
        </button>
      </div>
    </>
  );
}
