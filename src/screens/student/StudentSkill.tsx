import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import ProgressBar from '../../components/ProgressBar';
import { useOnboarding } from '../../context/OnboardingContext';

const LEVELS: { key: string; title: string; desc: string; icon: string }[] = [
  {
    key: '입문',
    title: '입문',
    desc: '노래를 거의 배워본 적이 없어요.',
    icon: '🌱',
  },
  {
    key: '초급',
    title: '초급',
    desc: '취미로 부르지만 발성/호흡은 잘 몰라요.',
    icon: '🎵',
  },
  {
    key: '중급',
    title: '중급',
    desc: '기본기는 어느 정도 있지만 한계가 있어요.',
    icon: '🎤',
  },
  {
    key: '상급',
    title: '상급',
    desc: '레슨 경험이 많고 디테일을 다듬고 싶어요.',
    icon: '⭐',
  },
];

export default function StudentSkill() {
  const navigate = useNavigate();
  const { student, updateStudent } = useOnboarding();
  const canNext = !!student.skillLevel;

  return (
    <>
      <TopBar />
      <ProgressBar current={5} total={6} />
      <div className="screen">
        <h1>현재 실력을 솔직하게 알려주세요</h1>
        <p className="subtitle">자가진단이라 정답은 없어요. 강사 매칭에 사용돼요.</p>

        <div className="options" style={{ marginTop: 8 }}>
          {LEVELS.map((l) => (
            <button
              key={l.key}
              type="button"
              className={`option ${student.skillLevel === l.key ? 'selected' : ''}`}
              onClick={() => updateStudent({ skillLevel: l.key })}
            >
              <div className="icon">{l.icon}</div>
              <div>
                <div className="title">{l.title}</div>
                <div className="desc">{l.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="footer">
        <button
          className="btn btn-primary"
          disabled={!canNext}
          onClick={() => navigate('/student/problem')}
        >
          다음
        </button>
      </div>
    </>
  );
}
