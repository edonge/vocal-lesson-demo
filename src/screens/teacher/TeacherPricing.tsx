import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';

const DURATIONS = ['30분', '50분', '60분', '90분'];

export default function TeacherPricing() {
  const navigate = useNavigate();
  const { teacher, updateTeacher } = useOnboarding();

  const canNext =
    teacher.priceSingle.trim().length > 0 &&
    !!teacher.lessonMinutes &&
    teacher.pricePackage4.trim().length > 0 &&
    teacher.trialProvided !== null &&
    (teacher.trialProvided === false || teacher.trialPrice.trim().length > 0);

  return (
    <>
      <TopBar />
      <ProgressBar current={5} total={6} />
      <div className="screen">
        <h1>수업 가격을 자세히 알려주세요</h1>
        <p className="subtitle">금액은 언제든 수정할 수 있어요. 수강생은 1회 가격을 가장 먼저 봐요.</p>

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

        <div className="field">
          <label className="label">1회 수업 가격</label>
          <input
            className="input"
            inputMode="numeric"
            placeholder="50,000"
            value={teacher.priceSingle}
            onChange={(e) =>
              updateTeacher({ priceSingle: e.target.value.replace(/[^0-9]/g, '') })
            }
          />
          <div className="hint">원</div>
        </div>

        <div className="row-2">
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
            <div className="hint">원</div>
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
            <div className="hint">원</div>
          </div>
        </div>

        <div className="field" style={{ marginTop: 8 }}>
          <label className="label">체험 수업 제공 여부</label>
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
        </div>

        {teacher.trialProvided === true && (
          <div className="field">
            <label className="label">체험 수업 가격</label>
            <input
              className="input"
              inputMode="numeric"
              placeholder="20,000"
              value={teacher.trialPrice}
              onChange={(e) =>
                updateTeacher({ trialPrice: e.target.value.replace(/[^0-9]/g, '') })
              }
            />
            <div className="hint">무료로 제공한다면 0 을 입력해주세요</div>
          </div>
        )}
      </div>

      <div className="footer">
        <button className="btn btn-primary" disabled={!canNext} onClick={() => navigate('/teacher/bio')}>
          다음
        </button>
      </div>
    </>
  );
}
