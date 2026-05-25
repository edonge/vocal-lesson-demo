import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';

const ITEMS = [
  { icon: '⚙️', label: '계정 설정' },
  { icon: '✅', label: '강사 인증 상태', value: '인증 대기' },
  { icon: '📢', label: '홍보 상품 / 결제 관리', value: '무료 베타' },
  { icon: '🔔', label: '알림 설정' },
  { icon: '📊', label: '통계 / 정산' },
  { icon: '🛟', label: '고객센터' },
  { icon: '📄', label: '이용약관 및 정책' },
];

export default function TeacherMy() {
  const navigate = useNavigate();
  const { teacher, reset } = useOnboarding();

  return (
    <>
      <div className="app-header">
        <div className="greeting">마이</div>
        <div className="title">{teacher.name || '선생님'} 선생님</div>
      </div>

      <div className="tab-screen">
        <div className="my-list">
          {ITEMS.map((it) => (
            <button key={it.label} className="item">
              <span className="ic">{it.icon}</span>
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.value && (
                <span style={{ fontSize: 12, color: 'var(--blue-600)', fontWeight: 600 }}>
                  {it.value}
                </span>
              )}
              <span className="chev">›</span>
            </button>
          ))}
          <button
            className="item"
            onClick={() => {
              reset();
              navigate('/');
            }}
          >
            <span className="ic">↩</span>
            <span style={{ flex: 1 }}>처음부터 다시 시작 (데모)</span>
            <span className="chev">›</span>
          </button>
        </div>
      </div>
    </>
  );
}
