import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import ChipGroup from '../../components/ChipGroup';
import { useOnboarding } from '../../context/OnboardingContext';

const OPTIONS = ['발라드', 'R&B', '락/밴드', 'K-pop', '뮤지컬', '팝송', '재즈', '아직 잘 모르겠음'];

export default function StudentGenres() {
  const navigate = useNavigate();
  const { student, toggleStudentField } = useOnboarding();
  const canNext = student.genres.length > 0;
  return (
    <>
      <TopBar />
      <ProgressBar current={4} total={6} />
      <div className="screen">
        <h1>주로 부르고 싶은 장르는요?</h1>
        <p className="subtitle">정하지 않았다면 '아직 잘 모르겠음'을 골라도 좋아요.</p>
        <ChipGroup
          options={OPTIONS}
          selected={student.genres}
          onToggle={(v) => toggleStudentField('genres', v)}
        />
      </div>
      <div className="footer">
        <button className="btn btn-primary" disabled={!canNext} onClick={() => navigate('/student/skill')}>
          다음
        </button>
      </div>
    </>
  );
}
