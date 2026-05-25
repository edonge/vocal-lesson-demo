import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/TopBar';
import TrainerProfileView, { TrainerView } from '../../components/TrainerProfileView';
import { useStudentActivity } from '../../context/StudentActivityContext';
import { TRAINERS } from '../../mocks/trainers';

export default function TrainerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRecentTrainer, favoriteTrainerIds, toggleFavorite } = useStudentActivity();
  const trainer = TRAINERS.find((t) => t.id === id);

  useEffect(() => {
    if (trainer) addRecentTrainer(trainer.id);
  }, [addRecentTrainer, trainer]);

  if (!trainer) {
    return (
      <>
        <TopBar />
        <div className="screen">
          <h1>트레이너를 찾을 수 없어요</h1>
        </div>
      </>
    );
  }

  const view: TrainerView = {
    name: trainer.name,
    initial: trainer.initial,
    gradient: trainer.gradient,
    location: trainer.location,
    tags: trainer.tags,
    target: trainer.target,
    intro: trainer.intro,
    bio: trainer.bio,
    teachingPhilosophy: trainer.teachingPhilosophy,
    recommendedFor: trainer.recommendedFor,
    curriculum: trainer.curriculum,
    lessonMethods: trainer.lessonMethods,
    portfolioLinks: trainer.portfolioLinks,
    notices: trainer.notices,
    faqs: trainer.faqs,
    reviews: trainer.reviews,
    rating: trainer.rating,
    reviewCount: trainer.reviewCount,
    experienceYears: trainer.experienceYears,
    lessonMinutes: trainer.lessonMinutes,
    priceSingle: trainer.price,
    trialPrice: trainer.trialPrice,
    packagePrice: trainer.packagePrice,
    package8Price: trainer.package8Price ?? null,
    priceVisibility: trainer.priceVisibility,
  };

  return (
    <>
      <TopBar title="트레이너 상세" />
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--gray-50)' }}>
        <TrainerProfileView view={view} />
        <div style={{ height: 100 }} />
      </div>
      <div className="cta-fixed">
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-outline"
            style={{ flex: '0 0 56px', fontSize: 20 }}
            aria-label="찜하기"
            onClick={() => toggleFavorite(trainer.id)}
          >
            {favoriteTrainerIds.includes(trainer.id) ? '♥' : '♡'}
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => navigate(`/app/student/consult/${trainer.id}`)}
          >
            상담하기
          </button>
        </div>
      </div>
    </>
  );
}
