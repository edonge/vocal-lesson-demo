import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import ChipGroup from '../../components/ChipGroup';
import { useOnboarding } from '../../context/OnboardingContext';

const OPTIONS = ['서울시', '성동구', '마포구', '홍대', '합정', '강남', '온라인 가능'];

export default function TeacherRegion() {
  const navigate = useNavigate();
  const { teacher, toggleTeacherField } = useOnboarding();
  const canNext = teacher.regions.length > 0;
  return (
    <>
      <TopBar />
      <ProgressBar current={2} total={6} />
      <div className="screen">
        <h1>주로 활동하시는 지역은요?</h1>
        <p className="subtitle">여러 지역을 동시에 선택할 수 있어요.</p>
        <ChipGroup
          options={OPTIONS}
          selected={teacher.regions}
          onToggle={(v) => toggleTeacherField('regions', v)}
        />
      </div>
      <div className="footer">
        <button className="btn btn-primary" disabled={!canNext} onClick={() => navigate('/teacher/targets')}>
          다음
        </button>
      </div>
    </>
  );
}
