import { useNavigate } from 'react-router-dom';
import { useStudentActivity } from '../context/StudentActivityContext';
import { TRAINERS } from '../mocks/trainers';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function priceText(n: number, visibility: 'public' | 'consult') {
  if (visibility === 'consult') return '상담 후 안내';
  return `${n.toLocaleString()}원`;
}

export default function CompareTray({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { compareTrainerIds, removeCompareTrainer, clearCompare } = useStudentActivity();
  const trainers = compareTrainerIds
    .map((id) => TRAINERS.find((t) => t.id === id))
    .filter((t): t is (typeof TRAINERS)[number] => Boolean(t));

  if (trainers.length < 2) return null;

  return (
    <>
      <div className="compare-tray">
        <div>
          <b>{trainers.length}명의 트레이너를 비교 중</b>
          <span>{trainers.map((t) => t.name).join(', ')}</span>
        </div>
        <button className="mini-btn primary" onClick={() => onOpenChange(true)}>
          비교하기
        </button>
      </div>

      {open && (
        <div className="sheet-backdrop" onClick={() => onOpenChange(false)}>
          <div className="compare-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <div>
                <div className="eyebrow">트레이너 비교</div>
                <h2>{trainers.length}명 비교하기</h2>
              </div>
              <button className="icon-action" onClick={() => onOpenChange(false)}>
                ×
              </button>
            </div>

            <div className="compare-grid" style={{ gridTemplateColumns: `92px repeat(${trainers.length}, 1fr)` }}>
              <div className="compare-label" />
              {trainers.map((t) => (
                <div key={t.id} className="compare-head">
                  <button className="remove" onClick={() => removeCompareTrainer(t.id)}>
                    ×
                  </button>
                  <div
                    className="avatar"
                    style={{
                      background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})`,
                    }}
                  >
                    {t.initial}
                  </div>
                  <b>{t.name}</b>
                  <button className="compare-link" onClick={() => navigate(`/app/student/trainers/${t.id}`)}>
                    상세 보기
                  </button>
                  <button className="compare-link primary" onClick={() => navigate(`/app/student/consult/${t.id}`)}>
                    상담하기
                  </button>
                </div>
              ))}
              {[
                ['지역', ...trainers.map((t) => t.location)],
                ['1회 가격', ...trainers.map((t) => priceText(t.price, t.priceVisibility))],
                ['체험', ...trainers.map((t) => `${t.trialPrice.toLocaleString()}원`)],
                ['전문 분야', ...trainers.map((t) => t.tags.slice(0, 2).join(', '))],
                ['대상', ...trainers.map((t) => t.target.slice(0, 2).join(', '))],
                ['온라인', ...trainers.map((t) => (t.location.includes('온라인') || t.lessonMethods.some((m) => m.includes('온라인')) ? '가능' : '문의'))],
                ['평점', ...trainers.map((t) => `${t.rating.toFixed(1)} (${t.reviewCount})`)],
                ['가격 공개', ...trainers.map((t) => (t.priceVisibility === 'public' ? '공개' : '상담'))],
                ['소개', ...trainers.map((t) => t.intro)],
              ].map((row) =>
                row.map((cell, idx) => (
                  <div key={`${row[0]}-${idx}`} className={idx === 0 ? 'compare-label' : 'compare-cell'}>
                    {cell}
                  </div>
                ))
              )}
            </div>

            <div className="compare-actions-row">
              <button className="btn btn-outline" onClick={clearCompare}>
                비교 비우기
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/app/student/trainers/${trainers[0].id}`)}
              >
                첫 번째 상세 보기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
