import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import ChipGroup from '../../components/ChipGroup';
import { useOnboarding } from '../../context/OnboardingContext';

const OPTIONS = ['홍대', '합정', '신촌', '강남', '성수', '잠실', '온라인', '상관없음'];

export default function StudentRegion() {
  const navigate = useNavigate();
  const { student, toggleStudentField } = useOnboarding();
  const canNext = student.regions.length > 0;
  return (
    <>
      <TopBar />
      <ProgressBar current={2} total={6} />
      <div className="screen">
        <h1>어디서 수업받고 싶으세요?</h1>
        <p className="subtitle">희망 지역이나 수업 방식을 골라주세요. (중복 선택 가능)</p>
        <ChipGroup
          options={OPTIONS}
          selected={student.regions}
          onToggle={(v) => toggleStudentField('regions', v)}
        />
      </div>
      <div className="footer">
        <button className="btn btn-primary" disabled={!canNext} onClick={() => navigate('/student/goals')}>
          다음
        </button>
      </div>
    </>
  );
}
