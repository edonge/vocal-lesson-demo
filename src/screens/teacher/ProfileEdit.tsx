import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ChipGroup from '../../components/ChipGroup';
import {
  CurriculumStep,
  FaqItem,
  PortfolioLink,
  PortfolioType,
  useOnboarding,
} from '../../context/OnboardingContext';
import { computeTeacherCompletion } from '../../utils/teacherCompletion';

const REGION_OPTS = ['서울시', '성동구', '마포구', '홍대', '합정', '신촌', '강남', '성수', '잠실', '온라인 가능'];
const SPECIALTY_OPTS = ['발라드', '고음', '발성 교정', '믹스보이스', '음정/박자', '감정 표현', '뮤지컬', '녹음 디렉팅'];
const RECOMMENDED_OPTS = [
  '고음에서 목이 막히는 분',
  '노래방에서 안정적으로 부르고 싶은 분',
  '기초 발성을 처음부터 잡고 싶은 분',
  '입시보다 취미 중심으로 편하게 배우고 싶은 분',
  '녹음하거나 공연할 때 긴장하는 분',
  '음정/박자를 정확히 잡고 싶은 분',
];
const METHOD_OPTS = [
  '1:1 개인 레슨',
  '녹음 피드백 제공',
  '과제 제공',
  '수업 후 연습 루틴 제공',
  '반주/피아노 활용',
  '온라인 레슨 가능',
  '체험 수업 가능',
];
const PORTFOLIO_TYPES: { value: PortfolioType; label: string }[] = [
  { value: 'instagram', label: '인스타그램' },
  { value: 'youtube', label: '유튜브' },
  { value: 'video', label: '공연 영상' },
  { value: 'audio', label: '음원' },
  { value: 'cover', label: '대표 커버' },
  { value: 'space', label: '수업 공간' },
];
const DURATIONS = ['30분', '50분', '60분', '90분'];

export default function ProfileEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { teacher, updateTeacher, toggleTeacherField } = useOnboarding();
  const { percent, items } = useMemo(
    () => computeTeacherCompletion(teacher),
    [teacher]
  );
  const doneByKey = useMemo(
    () => Object.fromEntries(items.map((i) => [i.key, i.done])),
    [items]
  );

  // Scroll to hash on mount/change
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) return;
    const el = document.getElementById(`sec-${hash}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash]);

  // ---- helpers ----
  const updateCurriculum = (next: CurriculumStep[]) =>
    updateTeacher({ curriculum: next });
  const updateFaqs = (next: FaqItem[]) => updateTeacher({ faqs: next });
  const updateNotices = (next: string[]) => updateTeacher({ notices: next });
  const updatePortfolio = (next: PortfolioLink[]) =>
    updateTeacher({ portfolioLinks: next });

  const StatusPill = ({ done }: { done: boolean }) => (
    <span className={`status-pill-mini ${done ? 'done' : 'todo'}`}>
      {done ? '작성 완료' : '미작성'}
    </span>
  );

  return (
    <>
      <TopBar title="프로필 수정" />

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--gray-50)' }}>
        {/* 진행률 안내 */}
        <div
          style={{
            margin: '12px 20px 0',
            padding: 14,
            background: 'var(--white)',
            borderRadius: 14,
            border: '1px solid var(--gray-100)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>전체 완성도</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue-600)' }}>
              {percent}%
            </span>
          </div>
          <div className="completion-bar">
            <i style={{ width: `${percent}%` }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 8 }}>
            입력하는 즉시 미리보기에 반영돼요. 별도 저장 버튼 없이 작성하시면 됩니다.
          </div>
        </div>

        {/* A. 기본 정보 */}
        <div className="edit-section" id="sec-basic">
          <div className="head">
            <h3>A. 기본 정보</h3>
            <StatusPill done={doneByKey.basic} />
          </div>

          <div className="photo-upload-wrap" style={{ marginTop: 12 }}>
            <button
              type="button"
              className={`photo-upload ${teacher.photoUploaded ? 'filled' : ''}`}
              onClick={() => updateTeacher({ photoUploaded: !teacher.photoUploaded })}
            >
              {teacher.photoUploaded ? '✓' : '+'}
            </button>
            <div className="hint-row">
              {teacher.photoUploaded ? '사진이 등록되었어요' : '프로필 사진을 등록해주세요'}
            </div>
          </div>

          <div className="field">
            <label className="label">활동명</label>
            <input
              className="input"
              placeholder="활동명 또는 실명"
              value={teacher.name}
              onChange={(e) => updateTeacher({ name: e.target.value })}
            />
          </div>

          <div className="field">
            <label className="label">성별</label>
            <div className="chips">
              {['남성', '여성', '선택 안 함'].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`chip ${teacher.gender === g ? 'selected' : ''}`}
                  onClick={() => updateTeacher({ gender: g })}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="label">활동 지역</label>
            <ChipGroup
              options={REGION_OPTS}
              selected={teacher.regions}
              onToggle={(v) => toggleTeacherField('regions', v)}
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">한 줄 소개</label>
            <textarea
              className="textarea"
              placeholder="목이 쉬지 않는 고음 발성을 알려드립니다."
              maxLength={60}
              value={teacher.bio}
              onChange={(e) => updateTeacher({ bio: e.target.value })}
            />
            <div className="hint" style={{ textAlign: 'right' }}>
              {teacher.bio.length} / 60
            </div>
          </div>
        </div>

        {/* B. 자기소개 */}
        <div className="edit-section" id="sec-aboutMe">
          <div className="head">
            <h3>B. 자기소개</h3>
            <StatusPill done={doneByKey.aboutMe} />
          </div>
          <div className="help">
            수강생은 선생님의 경력보다 <b>“나와 잘 맞는 수업인지”</b>를 궁금해해요. 어떤 수강생을 잘
            가르치는지, 수업 분위기는 어떤지 적어보세요.
          </div>
          <textarea
            className="textarea"
            style={{ minHeight: 140 }}
            placeholder="어떤 수강생을 주로 가르치는지, 어떤 방식으로 수업하는지 소개해주세요."
            value={teacher.aboutMe}
            onChange={(e) => updateTeacher({ aboutMe: e.target.value })}
          />
          <div className="hint" style={{ textAlign: 'right', marginTop: 6 }}>
            {teacher.aboutMe.length}자 · 30자 이상 권장
          </div>
        </div>

        {/* C. 수업 철학 */}
        <div className="edit-section" id="sec-philosophy">
          <div className="head">
            <h3>C. 수업 철학</h3>
            <StatusPill done={doneByKey.philosophy} />
          </div>
          <div className="help">좋은 보컬 수업에 대해 선생님이 중요하게 생각하는 기준을 적어주세요.</div>
          <textarea
            className="textarea"
            placeholder="무조건 높은 음을 내는 것보다, 오래 노래할 수 있는 건강한 발성을 중요하게 생각합니다."
            value={teacher.teachingPhilosophy}
            onChange={(e) => updateTeacher({ teachingPhilosophy: e.target.value })}
          />
        </div>

        {/* D. 이런 분께 추천 */}
        <div className="edit-section" id="sec-recommendedFor">
          <div className="head">
            <h3>D. 이런 분께 추천</h3>
            <StatusPill done={doneByKey.recommendedFor} />
          </div>
          <div className="help">
            딱 맞는 수강생만 모이게 만드는 가장 효과적인 섹션이에요. 해당되는 항목을 선택해주세요.
          </div>
          <ChipGroup
            options={RECOMMENDED_OPTS}
            selected={teacher.recommendedFor}
            onToggle={(v) => toggleTeacherField('recommendedFor', v)}
          />
        </div>

        {/* E. 수업 커리큘럼 */}
        <div className="edit-section" id="sec-curriculum">
          <div className="head">
            <h3>E. 수업 커리큘럼</h3>
            <StatusPill done={doneByKey.curriculum} />
          </div>
          <div className="help">
            첫 수업에서 무엇을 진단하고, 이후 어떻게 발전시키는지 단계별로 적어주세요.
          </div>
          <div className="curriculum-edit">
            {teacher.curriculum.map((c, i) => (
              <div key={i} className="item">
                <button
                  className="del"
                  onClick={() =>
                    updateCurriculum(teacher.curriculum.filter((_, idx) => idx !== i))
                  }
                  aria-label="단계 삭제"
                >
                  ✕
                </button>
                <input
                  className="input"
                  placeholder={`${i + 1}단계 제목 (예: 1회차 — 진단)`}
                  value={c.title}
                  onChange={(e) =>
                    updateCurriculum(
                      teacher.curriculum.map((v, idx) =>
                        idx === i ? { ...v, title: e.target.value } : v
                      )
                    )
                  }
                  style={{ marginBottom: 8 }}
                />
                <textarea
                  className="textarea"
                  placeholder="이 단계에서 무엇을 다루는지 설명해주세요"
                  value={c.desc}
                  onChange={(e) =>
                    updateCurriculum(
                      teacher.curriculum.map((v, idx) =>
                        idx === i ? { ...v, desc: e.target.value } : v
                      )
                    )
                  }
                  style={{ minHeight: 70 }}
                />
              </div>
            ))}
          </div>
          <button
            className="add"
            style={{ marginTop: teacher.curriculum.length ? 10 : 0 }}
            onClick={() =>
              updateCurriculum([...teacher.curriculum, { title: '', desc: '' }])
            }
          >
            + 단계 추가
          </button>
        </div>

        {/* F. 수업 방식 */}
        <div className="edit-section" id="sec-methods">
          <div className="head">
            <h3>F. 수업 방식</h3>
            <StatusPill done={doneByKey.methods} />
          </div>
          <div className="help">
            1:1 / 녹음 피드백 / 온라인 가능 등 수업 방식을 한눈에 보이게 해주세요.
          </div>
          <ChipGroup
            options={METHOD_OPTS}
            selected={teacher.lessonMethods}
            onToggle={(v) => toggleTeacherField('lessonMethods', v)}
          />
        </div>

        {/* G. 전문 분야 */}
        <div className="edit-section" id="sec-specialties">
          <div className="head">
            <h3>G. 전문 분야</h3>
            <StatusPill done={doneByKey.specialties} />
          </div>
          <ChipGroup
            options={SPECIALTY_OPTS}
            selected={teacher.specialties}
            onToggle={(v) => toggleTeacherField('specialties', v)}
          />
        </div>

        {/* H. 가격표 */}
        <div className="edit-section" id="sec-price">
          <div className="head">
            <h3>H. 가격표</h3>
            <StatusPill done={doneByKey.price} />
          </div>

          <div className="field">
            <label className="label">1회 수업 시간</label>
            <div className="chips">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`chip ${teacher.lessonMinutes === d ? 'selected' : ''}`}
                  onClick={() => updateTeacher({ lessonMinutes: d })}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="row-2">
            <div className="field">
              <label className="label">1회</label>
              <input
                className="input"
                inputMode="numeric"
                placeholder="50,000"
                value={teacher.priceSingle}
                onChange={(e) =>
                  updateTeacher({ priceSingle: e.target.value.replace(/[^0-9]/g, '') })
                }
              />
            </div>
            <div className="field">
              <label className="label">4회 패키지</label>
              <input
                className="input"
                inputMode="numeric"
                placeholder="180,000"
                value={teacher.pricePackage4}
                onChange={(e) =>
                  updateTeacher({ pricePackage4: e.target.value.replace(/[^0-9]/g, '') })
                }
              />
            </div>
          </div>

          <div className="field">
            <label className="label">8회 패키지 (선택)</label>
            <input
              className="input"
              inputMode="numeric"
              placeholder="340,000"
              value={teacher.pricePackage8}
              onChange={(e) =>
                updateTeacher({ pricePackage8: e.target.value.replace(/[^0-9]/g, '') })
              }
            />
          </div>

          <div className="field">
            <label className="label">체험 수업</label>
            <div className="chips">
              <button
                type="button"
                className={`chip ${teacher.trialProvided === true ? 'selected' : ''}`}
                onClick={() => updateTeacher({ trialProvided: true })}
              >
                제공해요
              </button>
              <button
                type="button"
                className={`chip ${teacher.trialProvided === false ? 'selected' : ''}`}
                onClick={() => updateTeacher({ trialProvided: false, trialPrice: '' })}
              >
                제공 안 해요
              </button>
            </div>
            {teacher.trialProvided && (
              <input
                className="input"
                style={{ marginTop: 10 }}
                inputMode="numeric"
                placeholder="체험 수업 가격 (무료는 0)"
                value={teacher.trialPrice}
                onChange={(e) =>
                  updateTeacher({ trialPrice: e.target.value.replace(/[^0-9]/g, '') })
                }
              />
            )}
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">가격 공개 여부</label>
            <div className="chips">
              <button
                type="button"
                className={`chip ${teacher.priceVisibility === 'public' ? 'selected' : ''}`}
                onClick={() => updateTeacher({ priceVisibility: 'public' })}
              >
                공개
              </button>
              <button
                type="button"
                className={`chip ${teacher.priceVisibility === 'consult' ? 'selected' : ''}`}
                onClick={() => updateTeacher({ priceVisibility: 'consult' })}
              >
                상담 후 안내
              </button>
            </div>
          </div>
        </div>

        {/* I. 포트폴리오 */}
        <div className="edit-section" id="sec-portfolio">
          <div className="head">
            <h3>I. 포트폴리오</h3>
            <StatusPill done={doneByKey.portfolio} />
          </div>
          <div className="help">
            인스타그램, 유튜브, 공연 영상, 음원 등을 자유롭게 추가해보세요. 실제 업로드는 다음
            단계에서 지원됩니다.
          </div>

          {teacher.portfolioLinks.map((p, i) => (
            <div key={i} className="item" style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 12, position: 'relative', marginBottom: 10 }}>
              <button
                className="del"
                onClick={() =>
                  updatePortfolio(teacher.portfolioLinks.filter((_, idx) => idx !== i))
                }
                aria-label="삭제"
                style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, color: 'var(--gray-400)' }}
              >
                ✕
              </button>
              <div className="chips" style={{ marginBottom: 8 }}>
                {PORTFOLIO_TYPES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`chip ${p.type === opt.value ? 'selected' : ''}`}
                    onClick={() =>
                      updatePortfolio(
                        teacher.portfolioLinks.map((v, idx) =>
                          idx === i ? { ...v, type: opt.value } : v
                        )
                      )
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <input
                className="input"
                placeholder="제목 또는 설명 (예: 유튜브 — 발성 강의 모음)"
                value={p.label}
                onChange={(e) =>
                  updatePortfolio(
                    teacher.portfolioLinks.map((v, idx) =>
                      idx === i ? { ...v, label: e.target.value } : v
                    )
                  )
                }
                style={{ background: 'var(--white)', marginBottom: 8 }}
              />
              <input
                className="input"
                placeholder="링크 URL (선택)"
                value={p.url}
                onChange={(e) =>
                  updatePortfolio(
                    teacher.portfolioLinks.map((v, idx) =>
                      idx === i ? { ...v, url: e.target.value } : v
                    )
                  )
                }
                style={{ background: 'var(--white)' }}
              />
            </div>
          ))}
          <button
            className="add"
            onClick={() =>
              updatePortfolio([
                ...teacher.portfolioLinks,
                { type: 'instagram', label: '', url: '' },
              ])
            }
          >
            + 포트폴리오 추가
          </button>
        </div>

        {/* J. 수업 공지 / 안내사항 */}
        <div className="edit-section" id="sec-notices">
          <div className="head">
            <h3>J. 수업 공지 / 안내사항</h3>
            <StatusPill done={doneByKey.notices} />
          </div>
          <div className="help">미리 안내해두면 첫 수업이 훨씬 매끄러워져요.</div>
          <div className="editable-list">
            {teacher.notices.map((n, i) => (
              <div key={i} className="row">
                <input
                  className="input"
                  placeholder="예) 수업 변경은 하루 전까지 가능합니다."
                  value={n}
                  onChange={(e) =>
                    updateNotices(
                      teacher.notices.map((v, idx) => (idx === i ? e.target.value : v))
                    )
                  }
                />
                <button
                  className="del"
                  onClick={() =>
                    updateNotices(teacher.notices.filter((_, idx) => idx !== i))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            className="add"
            onClick={() => updateNotices([...teacher.notices, ''])}
          >
            + 안내사항 추가
          </button>
        </div>

        {/* K. FAQ */}
        <div className="edit-section" id="sec-faqs">
          <div className="head">
            <h3>K. 자주 묻는 질문</h3>
            <StatusPill done={doneByKey.faqs} />
          </div>
          <div className="help">
            수강생이 상담 전에 자주 물어볼 내용을 미리 작성하면 상담 시간을 줄일 수 있어요.
          </div>
          <div className="faq-edit">
            {teacher.faqs.map((f, i) => (
              <div key={i} className="item">
                <button
                  className="del"
                  onClick={() => updateFaqs(teacher.faqs.filter((_, idx) => idx !== i))}
                  aria-label="삭제"
                >
                  ✕
                </button>
                <input
                  className="input"
                  placeholder="질문 (예: 완전 초보도 가능한가요?)"
                  value={f.q}
                  onChange={(e) =>
                    updateFaqs(
                      teacher.faqs.map((v, idx) =>
                        idx === i ? { ...v, q: e.target.value } : v
                      )
                    )
                  }
                  style={{ marginBottom: 8 }}
                />
                <textarea
                  className="textarea"
                  placeholder="답변"
                  value={f.a}
                  onChange={(e) =>
                    updateFaqs(
                      teacher.faqs.map((v, idx) =>
                        idx === i ? { ...v, a: e.target.value } : v
                      )
                    )
                  }
                  style={{ minHeight: 70 }}
                />
              </div>
            ))}
          </div>
          <button
            className="add"
            style={{ marginTop: teacher.faqs.length ? 10 : 0 }}
            onClick={() => updateFaqs([...teacher.faqs, { q: '', a: '' }])}
          >
            + 질문 추가
          </button>
        </div>

        <div style={{ height: 100 }} />
      </div>

      <div className="cta-fixed">
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-outline"
            style={{ flex: 1 }}
            onClick={() => navigate('/app/teacher/profile')}
          >
            완료
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => navigate('/app/teacher/preview')}
          >
            미리보기
          </button>
        </div>
      </div>
    </>
  );
}
