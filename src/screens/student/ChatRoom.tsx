import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import { TRAINERS } from '../../mocks/trainers';
import {
  formatClock,
  STATUS_LABEL,
  STATUS_TONE,
  useConsult,
} from '../../context/ConsultContext';

const QUICK_REPLIES = [
  '체험 수업 가능한가요?',
  '수업 장소가 어디인가요?',
  '평일 저녁 가능할까요?',
  '가격표 다시 볼 수 있을까요?',
  '첫 수업은 어떻게 진행되나요?',
];

export default function StudentChatRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, sendMessage, markRead } = useConsult();
  const consult = id ? getById(id) : undefined;
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) markRead(id, 'student');
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
          <h1>상담을 찾을 수 없어요</h1>
        </div>
      </>
    );
  }

  const trainer = TRAINERS.find((t) => t.id === consult.trainerId);
  const initial = trainer?.initial || consult.trainerName?.[0] || 'V';
  const gradient = trainer?.gradient || ['#0b67ff', '#0a52cc'];

  const send = (text: string) => {
    if (!text.trim()) return;
    sendMessage(consult.id, 'student', text.trim());
    setDraft('');
  };

  return (
    <>
      <TopBar title={`${consult.trainerName} 트레이너`} />

      <div className="chat-header">
        <div className="trainer-quickcard">
          <div
            className="avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              fontSize: 16,
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div className="col" style={{ flex: 1, minWidth: 0 }}>
            <span className="k">📍 {trainer?.location || '-'}</span>
            <span className="v">
              {trainer ? trainer.tags.slice(0, 2).map((t) => `#${t}`).join(' ') : ''}
            </span>
          </div>
          <div className="gap" />
          <div className="col" style={{ alignItems: 'flex-end' }}>
            <span className="k">1회</span>
            <span className="price">{trainer ? `${trainer.price.toLocaleString()}원` : '-'}</span>
          </div>
          {trainer && (
            <button
              className="more"
              onClick={() => navigate(`/app/student/trainers/${trainer.id}`)}
            >
              프로필
            </button>
          )}
        </div>
        <div style={{ marginTop: 8 }}>
          <span className={`s-pill ${STATUS_TONE[consult.status]}`}>
            {STATUS_LABEL[consult.status]}
          </span>
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
          <div key={m.id} className={`bubble-row ${m.sender === 'student' ? 'mine' : 'theirs'}`}>
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
          placeholder="메시지를 입력하세요"
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
