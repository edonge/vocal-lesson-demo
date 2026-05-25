import { useState } from 'react';
import {
  CurriculumStep,
  FaqItem,
  PortfolioLink,
  PORTFOLIO_META,
  TrainerReview,
} from '../mocks/trainers';

export type TrainerView = {
  name: string;
  initial: string;
  gradient: [string, string];
  location: string;
  tags: string[];
  target: string[];
  intro: string;
  bio: string;
  teachingPhilosophy: string;
  recommendedFor: string[];
  curriculum: CurriculumStep[];
  lessonMethods: string[];
  portfolioLinks: PortfolioLink[];
  notices: string[];
  faqs: FaqItem[];
  reviews: TrainerReview[];
  rating?: number;
  reviewCount?: number;
  experienceYears?: number;
  lessonMinutes: string;
  priceSingle: number | null;
  trialPrice: number | null;
  packagePrice: number | null;
  package8Price?: number | null;
  priceVisibility: 'public' | 'consult';
};

function formatPrice(n: number | null | undefined) {
  if (n === null || n === undefined) return '-';
  if (n === 0) return '무료';
  return `${n.toLocaleString()}원`;
}

export default function TrainerProfileView({ view }: { view: TrainerView }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showSection = (arr: unknown[] | string) => {
    if (Array.isArray(arr)) return arr.length > 0;
    return typeof arr === 'string' && arr.trim().length > 0;
  };

  return (
    <>
      {/* HERO */}
      <div className="detail-hero">
        <div className="top">
          <div
            className="avatar"
            style={{
              background: `linear-gradient(135deg, ${view.gradient[0]}, ${view.gradient[1]})`,
            }}
          >
            {view.initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="name">{view.name || '활동명 미입력'}</div>
            <div className="sub">
              📍 {view.location || '지역 미입력'}
              {view.experienceYears ? ` · 경력 ${view.experienceYears}년` : ''}
            </div>
            <div className="rating-row">
              {typeof view.rating === 'number' && view.reviewCount ? (
                <>
                  <span className="rating">
                    <span className="star">★</span> {view.rating.toFixed(1)}
                  </span>
                  <span className="reviewct">후기 {view.reviewCount}개</span>
                </>
              ) : (
                <span className="exp" style={{ fontSize: 13 }}>
                  아직 평가가 없어요
                </span>
              )}
            </div>
          </div>
        </div>
        {view.intro && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: 'var(--gray-50)',
              borderRadius: 12,
              fontSize: 14,
              color: 'var(--gray-700)',
              lineHeight: 1.55,
            }}
          >
            "{view.intro}"
          </div>
        )}
        {view.tags.length > 0 && (
          <div className="tag-list" style={{ marginTop: 12 }}>
            {view.tags.map((t) => (
              <span key={t} className="t">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="section-jump-nav">
        {[
          ['소개', 'section-intro'],
          ['커리큘럼', 'section-curriculum'],
          ['가격', 'section-price'],
          ['포트폴리오', 'section-portfolio'],
          ['FAQ', 'section-faq'],
          ['후기', 'section-reviews'],
        ].map(([label, id]) => (
          <button key={id} onClick={() => jump(id)}>
            {label}
          </button>
        ))}
      </div>

      <div className="detail-body">
        {/* 선생님 소개 */}
        {showSection(view.bio) && (
          <div className="detail-section" id="section-intro">
            <h3>선생님 소개</h3>
            <p>{view.bio}</p>
          </div>
        )}

        {/* 수업 철학 */}
        {showSection(view.teachingPhilosophy) && (
          <div className="detail-section">
            <h3>수업 철학</h3>
            <p>{view.teachingPhilosophy}</p>
          </div>
        )}

        {/* 이런 분께 추천 */}
        {showSection(view.recommendedFor) && (
          <div className="detail-section">
            <h3>이런 분께 추천해요</h3>
            {view.recommendedFor.map((r, i) => (
              <div key={i} className="bullet">
                <span className="dot" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        )}

        {/* 수업 커리큘럼 */}
        {showSection(view.curriculum) && (
          <div className="detail-section" id="section-curriculum">
            <h3>수업 커리큘럼</h3>
            <div className="curriculum-list">
              {view.curriculum.map((c, i) => (
                <div key={i} className="curriculum-step">
                  <div className="step-num">{i + 1}</div>
                  <div className="step-body">
                    <div className="step-title">{c.title}</div>
                    {c.desc && <div className="step-desc">{c.desc}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 수업 방식 */}
        {showSection(view.lessonMethods) && (
          <div className="detail-section">
            <h3>수업 방식</h3>
            <div className="tag-list">
              {view.lessonMethods.map((m) => (
                <span key={m} className="t gray">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 가격표 */}
        <div className="detail-section" id="section-price">
          <h3>
            가격표
            {view.priceVisibility === 'consult' && (
              <span style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 500, marginLeft: 6 }}>
                · 상담 후 안내
              </span>
            )}
          </h3>
          {view.priceVisibility === 'consult' ? (
            <p style={{ color: 'var(--gray-500)' }}>
              자세한 가격은 상담을 통해 안내드려요.
            </p>
          ) : (
            <>
              <div className="price-row">
                <span className="pk">체험 수업</span>
                <span className="pv">{formatPrice(view.trialPrice)}</span>
              </div>
              <div className="price-row">
                <span className="pk">1회 수업 ({view.lessonMinutes})</span>
                <span className="pv">{formatPrice(view.priceSingle)}</span>
              </div>
              <div className="price-row">
                <span className="pk">4회 패키지</span>
                <span className="pv">{formatPrice(view.packagePrice)}</span>
              </div>
              {view.package8Price ? (
                <div className="price-row">
                  <span className="pk">8회 패키지</span>
                  <span className="pv">{formatPrice(view.package8Price)}</span>
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* 포트폴리오 */}
        {showSection(view.portfolioLinks) && (
          <div className="detail-section" id="section-portfolio">
            <h3>포트폴리오</h3>
            <div className="portfolio-list">
              {view.portfolioLinks.map((p, i) => {
                const meta = PORTFOLIO_META[p.type];
                return (
                  <div key={i} className="portfolio-card">
                    <span className="ic">{meta?.icon || '🔗'}</span>
                    <div className="meta">
                      <div className="t">{meta?.label || '링크'}</div>
                      <div className="l">{p.label}</div>
                    </div>
                    <span className="chev">›</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 레슨 대상 */}
        {showSection(view.target) && (
          <div className="detail-section">
            <h3>레슨 대상</h3>
            <div className="tag-list">
              {view.target.map((t) => (
                <span key={t} className="t gray">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 수업 공지 */}
        {showSection(view.notices) && (
          <div className="detail-section">
            <h3>수업 공지 / 안내사항</h3>
            {view.notices.map((n, i) => (
              <div key={i} className="bullet">
                <span className="dot" />
                <span>{n}</span>
              </div>
            ))}
          </div>
        )}

        {/* FAQ */}
        {showSection(view.faqs) && (
          <div className="detail-section" id="section-faq">
            <h3>자주 묻는 질문</h3>
            <div className="faq-list">
              {view.faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className={`faq-item ${open ? 'open' : ''}`}>
                    <button
                      className="faq-q"
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      <span className="qmark">Q.</span>
                      <span style={{ flex: 1, textAlign: 'left' }}>{f.q}</span>
                      <span className="caret">{open ? '−' : '+'}</span>
                    </button>
                    {open && (
                      <div className="faq-a">
                        <span className="amark">A.</span>
                        <span>{f.a}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 후기 */}
        <div className="detail-section" id="section-reviews">
          <h3>
            후기{' '}
            {view.reviewCount ? (
              <>
                {view.reviewCount}개{' '}
                <span style={{ color: '#f59e0b' }}>★ {view.rating?.toFixed(1)}</span>
              </>
            ) : null}
          </h3>
          {view.reviews.length > 0 ? (
            view.reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="head">
                  <span>{r.author}</span>
                  <span className="star">★ {r.rating.toFixed(1)}</span>
                </div>
                <div className="text">{r.text}</div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--gray-400)' }}>아직 등록된 후기가 없어요</p>
          )}
        </div>
      </div>
    </>
  );
}
