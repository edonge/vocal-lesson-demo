import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useOnboarding } from '../context/OnboardingContext';

type Props = { variant: 'student' | 'teacher' };

export default function PlaceholderHome({ variant }: Props) {
  const navigate = useNavigate();
  const { reset } = useOnboarding();

  const isTeacher = variant === 'teacher';

  return (
    <>
      <TopBar title={isTeacher ? '강사 홈' : '강사 추천'} hideBack />
      <div className="placeholder-wrap">
        <div className="icon-big">{isTeacher ? '🏠' : '🔎'}</div>
        <h1 style={{ margin: 0, fontSize: 20 }}>
          {isTeacher ? '강사 홈은 다음 단계에서' : '추천 강사 목록은 다음 단계에서'}
          <br />
          구현 예정이에요
        </h1>
        <p style={{ fontSize: 14, color: 'var(--gray-500)', maxWidth: 280 }}>
          {isTeacher
            ? '여기에 본인 레슨 통계, 문의 알림, 프로필 관리, 노출 상품이 보여질 거예요.'
            : '여기에 조건에 맞는 트레이너 카드 리스트와 필터, 비교 기능이 보여질 거예요.'}
        </p>
      </div>
      <div className="footer">
        <button
          className="btn btn-ghost"
          onClick={() => {
            reset();
            navigate('/');
          }}
        >
          처음부터 다시 시작
        </button>
      </div>
    </>
  );
}
