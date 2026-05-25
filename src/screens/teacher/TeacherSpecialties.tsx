import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import ChipGroup from '../../components/ChipGroup';
import { useOnboarding } from '../../context/OnboardingContext';

const OPTIONS = ['발라드', '고음', '발성 교정', '믹스보이스', '음정/박자', '감정 표현', '뮤지컬', '녹음 디렉팅'];

export default function TeacherSpecialties() {
  const navigate = useNavigate();
  const { teacher, toggleTeacherField } = useOnboarding();
  const canNext = teacher.specialties.length > 0;
  return (
    <>
      <TopBar />
      <ProgressBar current={4} total={6} />
      <div className="screen">
        <h1>전문 분야가 무엇인가요?</h1>
        <p className="subtitle">선택한 분야가 프로필 태그로 노출돼요.</p>
        <ChipGroup
          options={OPTIONS}
          selected={teacher.specialties}
          onToggle={(v) => toggleTeacherField('specialties', v)}
        />
      </div>
      <div className="footer">
        <button className="btn btn-primary" disabled={!canNext} onClick={() => navigate('/teacher/pricing')}>
          다음
        </button>
      </div>
    </>
  );
}
