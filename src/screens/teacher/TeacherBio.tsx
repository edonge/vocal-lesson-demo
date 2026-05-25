import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';

export default function TeacherBio() {
  const navigate = useNavigate();
  const { teacher, updateTeacher } = useOnboarding();
  const canNext = teacher.bio.trim().length > 0;

  return (
    <>
      <TopBar />
      <ProgressBar current={6} total={6} />
      <div className="screen">
        <h1>한 줄 소개를 작성해주세요</h1>
        <p className="subtitle">수강생이 가장 먼저 보는 문구예요. 짧고 임팩트 있게.</p>

        <div className="field">
          <textarea
            className="textarea"
            placeholder="목이 쉬지 않는 고음 발성을 알려드립니다."
            maxLength={60}
            value={teacher.bio}
            onChange={(e) => updateTeacher({ bio: e.target.value })}
          />
          <div className="hint" style={{ textAlign: 'right' }}>
            {teacher.bio.length} / 60
          </div>
        </div>
      </div>

      <div className="footer">
        <button className="btn btn-primary" disabled={!canNext} onClick={() => navigate('/teacher/complete')}>
          완료
        </button>
      </div>
    </>
  );
}
