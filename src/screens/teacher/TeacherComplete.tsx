import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { useOnboarding } from '../../context/OnboardingContext';

function formatPrice(n: string) {
  if (!n) return '-';
  return `${Number(n).toLocaleString()}원`;
}

export default function TeacherComplete() {
  const navigate = useNavigate();
  const { teacher } = useOnboarding();

  // simple completion calc
  const completionParts = [
    !!teacher.name,
    !!teacher.gender,
    teacher.photoUploaded,
    teacher.regions.length > 0,
    teacher.targets.length > 0,
    teacher.specialties.length > 0,
    !!teacher.priceSingle,
    !!teacher.lessonMinutes,
    !!teacher.pricePackage4,
    teacher.trialProvided !== null,
    !!teacher.bio,
  ];
  const completion = Math.round(
    (completionParts.filter(Boolean).length / completionParts.length) * 100
  );

  const initial = teacher.name?.[0] || 'V';

  return (
    <>
      <TopBar hideBack />
      <div className="screen">
        <div className="celebrate">
          <div className="badge">✨</div>
          <h1>프로필이 준비되었어요</h1>
          <p>수강생에게 이렇게 보여요. 언제든 수정할 수 있어요.</p>
        </div>

        <div style={{ height: 12 }} />

        <div className="profile-card">
          <div className="head">
            <div className="profile-avatar">{initial}</div>
            <div>
              <div className="name">{teacher.name || '이름 미입력'} 트레이너</div>
              <div className="region">
                📍 {teacher.regions.length ? teacher.regions.join(' · ') : '지역 미입력'}
              </div>
            </div>
          </div>

          <div className="tag-row">
            {teacher.specialties.slice(0, 6).map((s) => (
              <span key={s} className="tag">
                #{s}
              </span>
            ))}
          </div>

          <div className="bio">"{teacher.bio || '한 줄 소개를 입력해주세요.'}"</div>

          <div className="tag-row" style={{ marginBottom: 8 }}>
            {teacher.targets.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>

          <div className="meta">
            <div className="price">
              {formatPrice(teacher.priceSingle)}
              <small>/ {teacher.lessonMinutes || '1회'}</small>
            </div>
            {teacher.trialProvided && <div className="tag">체험 수업 제공</div>}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-row">
            <span className="k">1회 수업</span>
            <span className="v">
              {teacher.lessonMinutes ? `${teacher.lessonMinutes} · ` : ''}
              {formatPrice(teacher.priceSingle)}
            </span>
          </div>
          <div className="summary-row">
            <span className="k">4회 패키지</span>
            <span className="v">{formatPrice(teacher.pricePackage4)}</span>
          </div>
          {teacher.pricePackage8 && (
            <div className="summary-row">
              <span className="k">8회 패키지</span>
              <span className="v">{formatPrice(teacher.pricePackage8)}</span>
            </div>
          )}
          <div className="summary-row">
            <span className="k">체험 수업</span>
            <span className="v">
              {teacher.trialProvided
                ? teacher.trialPrice === '0'
                  ? '무료 제공'
                  : `${formatPrice(teacher.trialPrice)} 제공`
                : '제공 안 함'}
            </span>
          </div>
        </div>

        <div className="summary-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>프로필 완성도</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue-600)' }}>{completion}%</span>
          </div>
          <div className="completion-bar">
            <i style={{ width: `${completion}%` }} />
          </div>
          <div className="hint" style={{ marginTop: 4 }}>
            프로필이 완성될수록 노출 우선순위가 높아져요.
          </div>
        </div>
      </div>

      <div className="footer">
        <button className="btn btn-primary" onClick={() => navigate('/app/teacher/home')}>
          강사 홈으로 이동
        </button>
      </div>
    </>
  );
}
