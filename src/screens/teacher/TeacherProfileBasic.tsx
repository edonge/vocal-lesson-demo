import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';

const TOTAL = 6;
const GENDERS = ['남성', '여성', '선택 안 함'];

export default function TeacherProfileBasic() {
  const navigate = useNavigate();
  const { teacher, updateTeacher } = useOnboarding();
  const canNext = teacher.name.trim().length > 0 && !!teacher.gender;

  return (
    <>
      <TopBar />
      <ProgressBar current={1} total={TOTAL} />
      <div className="screen">
        <h1>강사 프로필을 만들어볼게요</h1>
        <p className="subtitle">수강생에게 보여질 기본 정보예요.</p>

        <div className="photo-upload-wrap">
          <button
            type="button"
            className={`photo-upload ${teacher.photoUploaded ? 'filled' : ''}`}
            onClick={() => updateTeacher({ photoUploaded: !teacher.photoUploaded })}
            aria-label="프로필 사진 등록"
          >
            {teacher.photoUploaded ? '✓' : '+'}
          </button>
          <div className="hint-row">
            {teacher.photoUploaded ? '사진이 등록되었어요' : '프로필 사진을 등록해주세요'}
          </div>
        </div>

        <div style={{ height: 8 }} />

        <div className="field">
          <label className="label">활동명 또는 실명</label>
          <input
            className="input"
            placeholder="이름을 입력하세요"
            value={teacher.name}
            onChange={(e) => updateTeacher({ name: e.target.value })}
          />
        </div>

        <div className="field">
          <label className="label">성별</label>
          <div className="chips">
            {GENDERS.map((g) => (
              <button
                key={g}
                type="button"
                className={`chip ${teacher.gender === g ? 'selected' : ''}`}
                onClick={() => updateTeacher({ gender: g })}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="footer">
        <button className="btn btn-primary" disabled={!canNext} onClick={() => navigate('/teacher/region')}>
          다음
        </button>
      </div>
    </>
  );
}
