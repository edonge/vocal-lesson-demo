import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useOnboarding, Role } from '../context/OnboardingContext';

export default function RoleSelect() {
  const navigate = useNavigate();
  const { role, setRole } = useOnboarding();
  const [local, setLocal] = useState<Role>(role);

  const next = () => {
    if (!local) return;
    setRole(local);
    navigate(local === 'student' ? '/student/basic' : '/teacher/profile');
  };

  return (
    <>
      <TopBar />
      <div className="screen">
        <h1>
          어떤 목적으로
          <br />
          Voccal을 사용하시나요?
        </h1>
        <p className="subtitle">선택에 따라 다음 단계가 달라져요.</p>

        <div className="options" style={{ marginTop: 8 }}>
          <button
            type="button"
            className={`option ${local === 'student' ? 'selected' : ''}`}
            onClick={() => setLocal('student')}
          >
            <div className="icon">🎤</div>
            <div>
              <div className="title">보컬 레슨을 찾고 있어요</div>
              <div className="desc">나에게 맞는 트레이너를 추천받고 싶어요.</div>
            </div>
          </button>

          <button
            type="button"
            className={`option ${local === 'teacher' ? 'selected' : ''}`}
            onClick={() => setLocal('teacher')}
          >
            <div className="icon">🎼</div>
            <div>
              <div className="title">보컬 트레이너로 등록하고 싶어요</div>
              <div className="desc">내 수업을 소개하고 수강생 문의를 받고 싶어요.</div>
            </div>
          </button>
        </div>
      </div>

      <div className="footer">
        <button className="btn btn-primary" disabled={!local} onClick={next}>
          다음
        </button>
      </div>
    </>
  );
}
