import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { computeTeacherCompletion } from '../../utils/teacherCompletion';

const SECTION_META: Record<string, { icon: string; hint: string }> = {
  basic: { icon: '👤', hint: '활동명, 사진, 지역, 한 줄 소개' },
  specialties: { icon: '🏷️', hint: '발라드 · 고음 · 발성 교정 등' },
  price: { icon: '💰', hint: '체험·1회·패키지 가격' },
  aboutMe: { icon: '📝', hint: '강사가 직접 적는 긴 자기소개' },
  philosophy: { icon: '💡', hint: '나만의 수업 가치관' },
  recommendedFor: { icon: '🎯', hint: '내 수업이 맞는 수강생 유형' },
  curriculum: { icon: '📚', hint: '단계별 수업 흐름' },
  methods: { icon: '🛠️', hint: '1:1 / 녹음 / 온라인 가능 여부' },
  portfolio: { icon: '🎬', hint: '커버 영상·SNS·공연 영상 링크' },
  notices: { icon: '📣', hint: '수업 전 안내사항 / 변경 정책' },
  faqs: { icon: '❓', hint: '상담 전 자주 받는 질문 정리' },
};

export default function TeacherProfileTab() {
  const navigate = useNavigate();
  const { teacher } = useOnboarding();
  const { percent, items, doneCount, totalCount } = computeTeacherCompletion(teacher);

  const exposureMsg =
    percent >= 70
      ? '현재 프로필은 노출 중입니다'
      : '검토 완료 후 수강생에게 노출됩니다';

  return (
    <>
      <div className="app-header">
        <div className="greeting">프로필</div>
        <div className="title">내 보컬 레슨 소개 페이지</div>
      </div>

      <div className="tab-screen">
        <div className="hub-status-card">
          <div className="row1">
            <div>
              <div className="status">{exposureMsg}</div>
              <div className="label">프로필 완성도</div>
            </div>
            <div className="pct">{percent}%</div>
          </div>
          <div className="bar">
            <i style={{ width: `${percent}%` }} />
          </div>
          <div className="status" style={{ marginTop: 8 }}>
            {doneCount}개 완료 · {totalCount - doneCount}개 미작성
          </div>
          <div className="row2">
            <button
              className="btn ghost"
              style={{ flex: 1 }}
              onClick={() => navigate('/app/teacher/preview')}
            >
              수강생 화면 미리보기
            </button>
            <button
              className="btn solid"
              style={{ flex: 1 }}
              onClick={() => navigate('/app/teacher/edit')}
            >
              프로필 수정하기
            </button>
          </div>
        </div>

        <div className="section">
          <div className="section-title">
            <span>소개 페이지 섹션 {totalCount}개</span>
            <span className="more">{doneCount}/{totalCount}</span>
          </div>
        </div>

        <div className="section-card-list">
          {items.map((it) => {
            const meta = SECTION_META[it.key];
            return (
              <button
                key={it.key}
                className="section-card"
                onClick={() => navigate(`/app/teacher/edit#${it.section}`)}
              >
                <span className="ic">{meta?.icon || '•'}</span>
                <div className="body">
                  <div className="title">
                    <span>{it.label}</span>
                    <span className={`status-pill-mini ${it.done ? 'done' : 'todo'}`}>
                      {it.done ? '작성 완료' : '미작성'}
                    </span>
                  </div>
                  <div className="hint">{meta?.hint || it.hook}</div>
                </div>
                <span className="chev">›</span>
              </button>
            );
          })}
        </div>

        <div style={{ height: 100 }} />
      </div>
    </>
  );
}
