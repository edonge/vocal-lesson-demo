import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  formatRelativeTime,
  STATUS_LABEL,
  STATUS_TONE,
  useConsult,
} from '../../context/ConsultContext';
import { TRAINERS } from '../../mocks/trainers';

export default function StudentChatList() {
  const navigate = useNavigate();
  const { consultations } = useConsult();

  const mine = useMemo(
    () =>
      consultations
        .filter((c) => c.studentId === 'me')
        .sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
    [consultations]
  );

  return (
    <>
      <div className="app-header">
        <div className="greeting">채팅</div>
        <div className="title">상담 중인 트레이너 {mine.length > 0 && `· ${mine.length}`}</div>
      </div>

      <div className="tab-screen">
        {mine.length === 0 ? (
          <div className="chat-list-empty">
            <div className="icon-big">💬</div>
            <h2>아직 상담 중인 선생님이 없어요</h2>
            <p>마음에 드는 트레이너를 찾고 상담을 시작해보세요.</p>
            <button
              className="btn btn-primary"
              style={{ maxWidth: 240, margin: '0 auto' }}
              onClick={() => navigate('/app/student/home')}
            >
              추천 강사 보러가기
            </button>
          </div>
        ) : (
          <div className="chat-list">
            {mine.map((c) => {
              const t = TRAINERS.find((x) => x.id === c.trainerId);
              const initial = t?.initial || c.trainerName?.[0] || 'V';
              const gradient = t?.gradient || ['#0b67ff', '#0a52cc'];
              return (
                <button
                  key={c.id}
                  className="chat-list-row"
                  onClick={() => navigate(`/app/student/chat/${c.id}`)}
                >
                  <div
                    className="avatar"
                    style={{
                      background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                    }}
                  >
                    {initial}
                  </div>
                  <div className="body">
                    <div className="row1">
                      <span className="name">{c.trainerName} 트레이너</span>
                      <span className="time">{formatRelativeTime(c.updatedAt)}</span>
                    </div>
                    <div className="meta">
                      {t ? (
                        <>
                          📍 {t.location} · {t.tags.slice(0, 2).map((tg) => `#${tg}`).join(' ')}
                        </>
                      ) : (
                        '강사 정보'
                      )}
                    </div>
                    <div className="last">{c.lastMessage}</div>
                    <div className="row3">
                      <span className={`s-pill ${STATUS_TONE[c.status]}`}>
                        {STATUS_LABEL[c.status]}
                      </span>
                      {c.unread.student > 0 && (
                        <span className="unread">{c.unread.student}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
