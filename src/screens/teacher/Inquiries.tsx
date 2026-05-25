import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ConsultStatus,
  formatRelativeTime,
  STATUS_LABEL,
  STATUS_TONE,
  useConsult,
} from '../../context/ConsultContext';

type Filter = 'all' | 'new' | 'active' | 'reservationPending' | 'closed';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'new', label: '신규 문의' },
  { key: 'active', label: '상담 중' },
  { key: 'reservationPending', label: '예약 대기' },
  { key: 'closed', label: '종료' },
];

function statusMatches(filter: Filter, status: ConsultStatus) {
  if (filter === 'all') return true;
  if (filter === 'active')
    return status === 'active' || status === 'trialProposed';
  return filter === status;
}

export default function TeacherInquiries() {
  const navigate = useNavigate();
  const { consultations } = useConsult();
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const c = { new: 0, active: 0, reservationPending: 0 };
    for (const x of consultations) {
      if (x.status === 'new') c.new += 1;
      if (x.status === 'active' || x.status === 'trialProposed') c.active += 1;
      if (x.status === 'reservationPending') c.reservationPending += 1;
    }
    return c;
  }, [consultations]);

  const filtered = useMemo(
    () =>
      consultations
        .filter((c) => statusMatches(filter, c.status))
        .sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
    [consultations, filter]
  );

  return (
    <>
      <div className="app-header">
        <div className="greeting">문의</div>
        <div className="title">수강생 문의 관리</div>
      </div>

      <div className="tab-screen">
        {/* 상단 카운터 */}
        <div className="inquiry-stats">
          <div className="inquiry-stat">
            <div className="v">{counts.new}</div>
            <div className="k">신규 문의</div>
          </div>
          <div className="inquiry-stat">
            <div className="v">{counts.active}</div>
            <div className="k">상담 중</div>
          </div>
          <div className="inquiry-stat">
            <div className="v">{counts.reservationPending}</div>
            <div className="k">예약 대기</div>
          </div>
        </div>

        {/* 필터 칩 */}
        <div className="filter-bar" style={{ padding: '12px 20px 8px' }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-chip ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="chat-list-empty">
            <div className="icon-big">📭</div>
            <h2>아직 도착한 문의가 없어요</h2>
            <p>프로필을 더 채우면 수강생이 상담을 시작하기 쉬워져요.</p>
            <button
              className="btn btn-primary"
              style={{ maxWidth: 240, margin: '0 auto' }}
              onClick={() => navigate('/app/teacher/profile')}
            >
              프로필 개선하기
            </button>
          </div>
        ) : (
          <div className="chat-list" style={{ gap: 10 }}>
            {filtered.map((c) => (
              <button
                key={c.id}
                className="inquiry-card"
                onClick={() => navigate(`/app/teacher/inquiries/${c.id}`)}
              >
                <div className="top">
                  <div
                    className="avatar"
                    style={{ background: c.studentColor, color: '#fff' }}
                  >
                    {c.studentInitial}
                  </div>
                  <div className="info">
                    <div className="head-row">
                      <span className="name">
                        {c.studentName}
                        {c.unread.teacher > 0 && (
                          <span
                            style={{
                              display: 'inline-block',
                              width: 6,
                              height: 6,
                              background: '#ef4444',
                              borderRadius: '50%',
                              marginLeft: 6,
                              verticalAlign: 'middle',
                            }}
                          />
                        )}
                      </span>
                      <span className="time">{formatRelativeTime(c.updatedAt)}</span>
                    </div>
                    <div className="factrow">
                      <div>
                        <span className="k">목적</span>
                        <b>{c.studentSummary.goals[0] || '-'}</b>
                      </div>
                      <div>
                        <span className="k">고민</span>
                        <b>{c.studentSummary.mainProblem || '-'}</b>
                      </div>
                      <div>
                        <span className="k">지역</span>
                        <b>{c.studentSummary.regions[0] || '-'}</b>
                      </div>
                      <div>
                        <span className="k">예산</span>
                        <b>{c.studentSummary.budget || '미지정'}</b>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="last">"{c.lastMessage}"</div>
                <div className="footrow">
                  <span className={`s-pill ${STATUS_TONE[c.status]}`}>
                    {STATUS_LABEL[c.status]}
                  </span>
                  <span className="reply-btn">답변하기</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
