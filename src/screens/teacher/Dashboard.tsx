import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../context/OnboardingContext';
import { TEACHER_DASHBOARD } from '../../mocks/teacherDashboard';
import { computeTeacherCompletion } from '../../utils/teacherCompletion';
import { formatRelativeTime, useConsult } from '../../context/ConsultContext';

function formatPrice(n: string) {
  if (!n) return '-';
  return `${Number(n).toLocaleString()}원`;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { teacher } = useOnboarding();
  const { consultations } = useConsult();
  const d = TEACHER_DASHBOARD;
  const initial = teacher.name?.[0] || 'V';

  const inquiryCount = consultations.length;
  const newCount = consultations.filter((c) => c.status === 'new').length;
  const recentInquiries = useMemo(
    () =>
      [...consultations]
        .sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 2),
    [consultations]
  );

  const { percent, items } = useMemo(
    () => computeTeacherCompletion(teacher),
    [teacher]
  );
  const undone = items.filter((i) => !i.done).slice(0, 5);

  // 성과 + 프로필 개선을 연결하는 인사이트 메시지
  const insights = useMemo(() => {
    const out: { ic: string; text: string }[] = [];
    if (!items.find((i) => i.key === 'portfolio')?.done) {
      out.push({
        ic: '🎬',
        text: '포트폴리오를 추가하면 수강생이 수업 스타일을 더 쉽게 이해할 수 있어요.',
      });
    }
    if (items.find((i) => i.key === 'price')?.done && teacher.priceVisibility === 'public') {
      out.push({
        ic: '💰',
        text: '가격표가 공개된 프로필은 상담 전에 신뢰를 주는 경향이 있어요.',
      });
    }
    if (!items.find((i) => i.key === 'curriculum')?.done) {
      out.push({
        ic: '📚',
        text: '커리큘럼을 채워두면 첫 상담에서 같은 질문을 반복하지 않아도 돼요.',
      });
    }
    if (!items.find((i) => i.key === 'faqs')?.done) {
      out.push({
        ic: '❓',
        text: 'FAQ를 미리 작성한 프로필은 상담 응답 시간이 짧아지는 경향이 있어요.',
      });
    }
    return out.slice(0, 3);
  }, [items, teacher.priceVisibility]);

  return (
    <>
      <div className="app-header">
        <div className="greeting">안녕하세요</div>
        <div className="title">
          {teacher.name || '선생님'} 선생님 <em>👋</em>
        </div>
        <div className="status-pill">
          <span className="dot" />
          {percent >= 70 ? '현재 프로필은 노출 중입니다' : '검토 완료 후 노출됩니다'}
        </div>
      </div>

      <div className="tab-screen">
        {/* 이번 주 성과 */}
        <div className="section">
          <div className="section-title">
            <span>이번 주 성과</span>
            <span className="more">자세히</span>
          </div>
        </div>
        <div className="dash-stats">
          <div className="dash-stat">
            <div className="v">{d.profileViews}</div>
            <div className="k">프로필 조회</div>
          </div>
          <div className="dash-stat">
            <div className="v">{inquiryCount}</div>
            <div className="k">상담 문의</div>
          </div>
          <div className="dash-stat">
            <div className="v">{d.likes}</div>
            <div className="k">찜</div>
          </div>
          <div className="dash-stat">
            <div className="v">{d.reviewsCount}</div>
            <div className="k">후기</div>
          </div>
        </div>

        {/* 성과 ↔ 프로필 개선 연결 인사이트 */}
        {insights.length > 0 && (
          <div className="insight-card">
            <h3>오늘의 인사이트</h3>
            {insights.map((s, i) => (
              <div key={i} className="item">
                <span className="ic">{s.ic}</span>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* 미리보기 CTA */}
        <div className="preview-cta-card">
          <div className="ico">👀</div>
          <div className="body">
            <div className="t">수강생에게 보이는 내 소개 페이지를 확인해보세요</div>
            <div className="d">한 줄 소개, 가격, 커리큘럼, 후기까지 한 번에 보여요.</div>
          </div>
          <button
            className="btn"
            onClick={() => navigate('/app/teacher/preview')}
          >
            미리보기
          </button>
        </div>

        {/* 프로필 개선 추천 */}
        {undone.length > 0 && (
          <div className="improve-card">
            <div className="head">
              <h3>프로필 개선 추천</h3>
              <span style={{ fontSize: 12, color: 'var(--blue-600)', fontWeight: 600 }}>
                +{undone.length}건
              </span>
            </div>
            <div className="lead">
              상담 전환율이 높은 강사들은 이런 정보를 채워두었어요.
            </div>
            {undone.map((it, i) => (
              <button
                key={it.key}
                className="improve-row"
                onClick={() => navigate(`/app/teacher/edit#${it.section}`)}
              >
                <span className="num">{i + 1}</span>
                <div className="body">
                  <div className="t">{it.label} 작성하기</div>
                  <div className="h">{it.hook}</div>
                </div>
                <span className="chev">›</span>
              </button>
            ))}
          </div>
        )}

        {/* 내 프로필 요약 */}
        <div className="dash-card">
          <h3>
            내 프로필
            <small>관리</small>
          </h3>
          <div className="mini-profile">
            <div
              className="avatar"
              style={{ background: 'linear-gradient(135deg, #0b67ff, #0a52cc)' }}
            >
              {initial}
            </div>
            <div className="info">
              <div className="name">{teacher.name || '활동명 미입력'}</div>
              <div className="meta">
                📍 {teacher.regions.join(' · ') || '지역 미입력'}
              </div>
              <div className="meta">
                {teacher.specialties.slice(0, 3).join(' · ') || '전문 분야 미입력'}
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              color: 'var(--gray-700)',
              padding: '8px 0',
              borderTop: '1px dashed var(--gray-100)',
              borderBottom: '1px dashed var(--gray-100)',
            }}
          >
            <span>레슨 대상</span>
            <span style={{ fontWeight: 600 }}>{teacher.targets.join(', ') || '-'}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              color: 'var(--gray-700)',
              padding: '8px 0',
            }}
          >
            <span>1회 가격</span>
            <span style={{ fontWeight: 700 }}>
              {teacher.lessonMinutes ? `${teacher.lessonMinutes} · ` : ''}
              {formatPrice(teacher.priceSingle)}
            </span>
          </div>
          <div className="dash-row">
            <button
              className="btn btn-outline"
              onClick={() => navigate('/app/teacher/edit')}
            >
              프로필 수정
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/app/teacher/profile')}
            >
              섹션별 관리
            </button>
          </div>
        </div>

        {/* 프로필 완성도 체크리스트 (상세) */}
        <div className="dash-card">
          <h3>
            프로필 완성도
            <small>{percent}%</small>
          </h3>
          <div className="completion-bar">
            <i style={{ width: `${percent}%` }} />
          </div>
          <div style={{ marginTop: 6 }}>
            {items.map((c) => (
              <button
                key={c.key}
                className={`checklist-item ${c.done ? 'done' : ''}`}
                style={{ width: '100%', textAlign: 'left' }}
                onClick={() => navigate(`/app/teacher/edit#${c.section}`)}
              >
                <span className="box">{c.done ? '✓' : ''}</span>
                <span className="label">{c.label}</span>
                {!c.done && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: 11,
                      color: 'var(--blue-600)',
                      fontWeight: 600,
                    }}
                  >
                    작성하기 ›
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 오늘의 할 일 */}
        <div className="dash-card">
          <h3>오늘의 할 일</h3>
          {d.todoList.map((t) => (
            <div key={t} className="todo-item">
              <span className="ic">○</span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        {/* 신규 문의 */}
        <div className="dash-card">
          <h3>
            신규 문의 {newCount > 0 && <small>+{newCount}건</small>}
          </h3>
          {recentInquiries.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--gray-400)', padding: '8px 0' }}>
              아직 도착한 문의가 없어요.
            </div>
          ) : (
            recentInquiries.map((q) => (
              <button
                key={q.id}
                className="inquiry-row"
                style={{ width: '100%', textAlign: 'left' }}
                onClick={() => navigate(`/app/teacher/inquiries/${q.id}`)}
              >
                <div
                  className="avatar"
                  style={{ background: q.studentColor, borderRadius: '50%' }}
                >
                  {q.studentInitial}
                </div>
                <div className="body">
                  <div className="name-row">
                    <span className="name">
                      {q.studentName}
                      {q.unread.teacher > 0 && <span className="new" />}
                    </span>
                    <span className="time">{formatRelativeTime(q.updatedAt)}</span>
                  </div>
                  <div className="msg">{q.lastMessage}</div>
                </div>
              </button>
            ))
          )}
          <button
            className="btn btn-ghost"
            style={{ height: 38, fontSize: 13, marginTop: 8 }}
            onClick={() => navigate('/app/teacher/inquiries')}
          >
            전체 문의 보기 ({inquiryCount})
          </button>
        </div>

        {/* 홍보 상태 */}
        <div className="promo-card">
          <div className="plan">현재 플랜</div>
          <div className="name">{d.currentPlan}</div>
          <div className="note">
            {d.exposureStatus}
            <br />
            {d.exposureNote}
          </div>
          <button className="btn">홍보 상품 보기</button>
        </div>

        <div style={{ height: 100 }} />
      </div>
    </>
  );
}
