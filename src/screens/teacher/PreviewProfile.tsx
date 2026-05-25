import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import TrainerProfileView, { TrainerView } from '../../components/TrainerProfileView';
import { useOnboarding } from '../../context/OnboardingContext';

function toNum(s: string) {
  if (!s) return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export default function PreviewProfile() {
  const navigate = useNavigate();
  const { teacher } = useOnboarding();

  const view: TrainerView = {
    name: teacher.name,
    initial: teacher.name?.[0] || 'V',
    gradient: ['#0b67ff', '#0a52cc'],
    location: teacher.regions.join(' · '),
    tags: teacher.specialties,
    target: teacher.targets,
    intro: teacher.bio,
    bio: teacher.aboutMe,
    teachingPhilosophy: teacher.teachingPhilosophy,
    recommendedFor: teacher.recommendedFor,
    curriculum: teacher.curriculum,
    lessonMethods: teacher.lessonMethods,
    portfolioLinks: teacher.portfolioLinks,
    notices: teacher.notices,
    faqs: teacher.faqs,
    reviews: [],
    lessonMinutes: teacher.lessonMinutes || '-',
    priceSingle: toNum(teacher.priceSingle),
    trialPrice: teacher.trialProvided ? toNum(teacher.trialPrice) : null,
    packagePrice: toNum(teacher.pricePackage4),
    package8Price: toNum(teacher.pricePackage8),
    priceVisibility: teacher.priceVisibility,
  };

  return (
    <>
      <TopBar title="미리보기" />
      <div className="preview-banner">👀 수강생에게 이렇게 보여져요</div>
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--gray-50)' }}>
        <TrainerProfileView view={view} />
        <div style={{ height: 100 }} />
      </div>
      <div className="cta-fixed">
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => navigate('/app/teacher/edit')}>
            프로필 수정하기
          </button>
        </div>
      </div>
    </>
  );
}
