import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import {
  ConsultStatus,
  formatClock,
  STATUS_LABEL,
  useConsult,
} from '../../context/ConsultContext';

const QUICK_REPLIES = [
  '첫 수업에서는 음역대와 발성 습관을 먼저 진단합니다.',
  '체험 수업은 30,000원입니다.',
  '평일 저녁 7시 이후 수업 가능합니다.',
  '자주 부르시는 곡을 알려주시면 상담에 도움이 됩니다.',
  '홍대입구역 근처 작업실에서 수업합니다.',
  '온라인 수업도 가능합니다.',
];

const ALL_STATUSES: ConsultStatus[] = [
  'new',
  'active',
  'trialProposed',
  'reservationPending',
  'reserved',
  'closed',
];

export default function InquiryDetail() {
  const { id } = useParams();
  const { getById, sendMessage, setStatus, markRead } = useConsult();
  const consult = id ? getById(id) : undefined;
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) markRead(id, 'teacher');
  }, [id, markRead]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [consult?.messages.length]);

  if (!consult) {
    return (
      <>
        <TopBar />
        <div className="screen">
          <h1>문의를 찾을 수 없어요</h1>
        </div>
      </>
    );
  }

  const send = (text: string) => {
    if (!text.trim()) return;
    sendMessage(consult.id, 'teacher', text.trim());
    setDraft('');
  };

  const s = consult.studentSummary;

  return (
    <>
      <TopBar title={`${consult.studentName}님 문의`} />

      <div className="chat-header">
        {/* 학생 정보 카드 */}
        <div className="student-summary-card">
          <div className="top">
            <div
              className="avatar"
              style={{
                background: consult.studentColor,
                color: '#fff',
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {consult.studentInitial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="name">{consult.studentName}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>
                {s.skillLevel ? `${s.skillLevel} · ` : ''}수강생
              </div>
            </div>
          </div>
          <div className="sum">
            <div className="row">
              <div className="k">레슨 목적</div>
              <div className="v">{s.goals.join(', ') || '-'}</div>
            </div>
            <div className="row">
              <div className="k">현재 고민</div>
              <div className="v">{s.mainProblem || '-'}</div>
            </div>
            <div className="row">
              <div className="k">선호 장르</div>
              <div className="v">{s.genres.join(', ') || '-'}</div>
            </div>
            <div className="row">
              <div className="k">희망 지역</div>
              <div className="v">{s.regions.join(', ') || '-'}</div>
            </div>
            <div className="row">
              <div className="k">예산</div>
              <div className="v">{s.budget || '미지정'}</div>
            </div>
            <div className="row">
              <div className="k">강사 스타일</div>
              <div className="v">{s.preferredStyle?.join(', ') || '미지정'}</div>
            </div>
          </div>
          {s.mainProblemDetail && (
            <div className="note">💡 "{s.mainProblemDetail}"</div>
          )}
        </div>

        {/* 상태 변경 */}
        <div className="status-control">
          <span className="k">상담 상태</span>
          <select
            value={consult.status}
            onChange={(e) => setStatus(consult.id, e.target.value as ConsultStatus)}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chat-area" ref={scrollRef}>
        <div className="day-divider">
          {new Date(consult.createdAt).toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
        </div>
        {consult.messages.map((m) => (
          <div
            key={m.id}
            className={`bubble-row ${m.sender === 'teacher' ? 'mine' : 'theirs'}`}
          >
            <div className="bubble">{m.text}</div>
            <span className="bubble-time">{formatClock(m.time)}</span>
          </div>
        ))}
      </div>

      <div className="quick-replies">
        {QUICK_REPLIES.map((q) => (
          <button key={q} className="quick-reply" onClick={() => send(q)}>
            {q}
          </button>
        ))}
      </div>

      <div className="chat-input">
        <input
          className="input"
          placeholder="답변을 입력하세요"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(draft);
            }
          }}
        />
        <button
          className="send"
          disabled={!draft.trim()}
          onClick={() => send(draft)}
          aria-label="보내기"
        >
          ↑
        </button>
      </div>
    </>
  );
}
