import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();
  return (
    <div className="splash">
      <div className="brand">
        <div className="logo">V</div>
        <div className="name">Voccal</div>
        <div className="tagline">
          내 목소리에 맞는 보컬 트레이너를
          <br />
          찾는 가장 쉬운 방법
        </div>
        <div className="wave" aria-hidden>
          <i /><i /><i /><i /><i /><i /><i />
        </div>
      </div>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={() => navigate('/auth')}>
          시작하기
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)' }}>
          가입하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다
        </div>
      </div>
    </div>
  );
}
