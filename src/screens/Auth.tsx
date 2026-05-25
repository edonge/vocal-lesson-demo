import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';

export default function Auth() {
  const navigate = useNavigate();
  return (
    <>
      <TopBar />
      <div className="screen">
        <h1>
          Voccal에 오신 것을
          <br />
          환영합니다
        </h1>
        <p className="subtitle">
          간편하게 시작해보세요.
          <br />
          소셜 계정으로 1초 안에 가입할 수 있어요.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <button className="btn btn-outline" onClick={() => navigate('/role')}>
            <span style={{ marginRight: 8 }}>􀉭</span>
            카카오로 계속하기
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/role')}>
            <span style={{ marginRight: 8 }}>􀉭</span>
            Apple로 계속하기
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/role')}>
            <span style={{ marginRight: 8 }}>􀉭</span>
            이메일로 계속하기
          </button>
        </div>
      </div>

      <div className="footer">
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => navigate('/role')}>
            시작하기
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => navigate('/role')}
            style={{ height: 44, background: 'transparent', color: 'var(--gray-700)', fontWeight: 500 }}
          >
            이미 계정이 있어요
          </button>
        </div>
      </div>
    </>
  );
}
