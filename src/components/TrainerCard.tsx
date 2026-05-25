import { Trainer } from '../mocks/trainers';

type Props = {
  trainer: Trainer;
  onClick?: () => void;
  onConsult?: () => void;
  favorite?: boolean;
  compareSelected?: boolean;
  onToggleFavorite?: () => void;
  onToggleCompare?: () => void;
  reason?: string;
};

function hasTrial(trainer: Trainer) {
  return trainer.lessonMethods.some((m) => m.includes('체험')) || trainer.trialPrice > 0;
}

function isOnline(trainer: Trainer) {
  return trainer.location.includes('온라인') || trainer.lessonMethods.some((m) => m.includes('온라인'));
}

function defaultReason(trainer: Trainer) {
  if (trainer.reviewCount >= 40) return `후기 ${trainer.reviewCount}개로 검증됐어요`;
  if (trainer.priceVisibility === 'public') return '가격이 공개되어 비교하기 쉬워요';
  if (isOnline(trainer)) return '온라인으로도 상담할 수 있어요';
  return `${trainer.tags[0]} 고민에 잘 맞아요`;
}

export default function TrainerCard({
  trainer,
  onClick,
  onConsult,
  favorite = false,
  compareSelected = false,
  onToggleFavorite,
  onToggleCompare,
  reason,
}: Props) {
  return (
    <article className="trainer-card">
      <div className="top">
        <div
          className="avatar"
          style={{
            background: `linear-gradient(135deg, ${trainer.gradient[0]}, ${trainer.gradient[1]})`,
          }}
        >
          {trainer.initial}
        </div>
        <div className="meta">
          <div className="name-row">
            <span className="name">{trainer.name}</span>
            <button
              type="button"
              className={`icon-action ${favorite ? 'on' : ''}`}
              onClick={onToggleFavorite}
              aria-label={favorite ? '찜 취소' : '찜하기'}
            >
              {favorite ? '♥' : '♡'}
            </button>
          </div>
          <div className="loc">📍 {trainer.location}</div>
          <div className="rating">
            <span className="star">★</span>
            <span>{trainer.rating.toFixed(1)}</span>
            <span className="count">· 후기 {trainer.reviewCount}</span>
          </div>
        </div>
      </div>

      <div className="tag-list">
        <span className="t strong">{defaultReason(trainer)}</span>
        {trainer.tags.slice(0, 3).map((t) => (
          <span key={t} className="t">
            #{t}
          </span>
        ))}
        {trainer.target.slice(0, 2).map((t) => (
          <span key={t} className="t gray">
            {t}
          </span>
        ))}
      </div>

      <div className="trainer-facts">
        <span>
          {trainer.priceVisibility === 'public'
            ? `${trainer.price.toLocaleString()}원/${trainer.lessonMinutes}`
            : '가격 상담 후 안내'}
        </span>
        <span>{hasTrial(trainer) ? `체험 ${trainer.trialPrice.toLocaleString()}원` : '체험 미운영'}</span>
        <span>{isOnline(trainer) ? '온라인 가능' : '대면 중심'}</span>
      </div>

      <div className="intro">"{trainer.intro}"</div>

      <div className="trainer-actions">
        <button
          type="button"
          className={`mini-btn ${compareSelected ? 'active' : ''}`}
          onClick={onToggleCompare}
        >
          {compareSelected ? '비교 중' : '비교 추가'}
        </button>
        <button type="button" className="mini-btn" onClick={onClick}>
          자세히 보기
        </button>
        {onConsult && (
          <button type="button" className="mini-btn primary" onClick={onConsult}>
            상담하기
          </button>
        )}
      </div>
      {reason && <div className="match-reason">{reason}</div>}
    </article>
  );
}
