import type { ApiTrainerDetail, ApiTrainerPreview } from '@/types/api';
import type { TrainerPreview, TrainerProfileDetail } from '@/types/ui';

/**
 * API → UI 타입 어댑터.
 *
 * API 응답을 UI 타입으로 정규화해서, 컴포넌트가 raw API 필드에
 * 직접 의존하지 않도록 한다.
 */

/** Home/Search 카드용. ApiTrainerPreview는 TrainerPreview의 superset이라 사실상 캐스팅. */
export function apiTrainerPreviewToUi(t: ApiTrainerPreview): TrainerPreview {
  return {
    id: t.id,
    name: t.name,
    location: t.location,
    genre: t.genre,
    highlight: t.highlight,
    description: t.description,
    tags: t.tags,
    career: t.career,
    reviews: t.reviews,
    price: t.price,
    image: t.image,
    bookmarked: t.bookmarked,
  };
}

/** API 시설 이름 → UI 카드가 인식하는 라벨로 매핑. 알 수 없는 항목은 null. */
function normalizeFacilityLabel(
  apiLabel: string
): '연습실' | '주차' | null {
  if (apiLabel === '연습실') return '연습실';
  if (apiLabel === '주차' || apiLabel === '주차공간') return '주차';
  return null;
}

function normalizeFacilityValue(
  value: string,
  available: boolean,
  label: '연습실' | '주차'
): '보유' | '미보유' | '가능' | '불가능' {
  if (value === '보유' || value === '미보유' || value === '가능' || value === '불가능') {
    return value;
  }
  // API 가 예상 외의 텍스트를 줘도 화면이 깨지지 않도록 fallback.
  if (label === '주차') return available ? '가능' : '불가능';
  return available ? '보유' : '미보유';
}

/**
 * 상세 페이지용.
 * - 시설: API 라벨("주차공간") → UI 라벨("주차") 매핑, 인식 못 한 항목은 제외
 * - works: UI 가 'audio' | 'video' 만 렌더하므로 필터링하고 subtitle 을 string 으로 보장
 * - reviews: createdAt 이 없으면 createdAt 필드를 빈 문자열로 채워 타입 만족
 */
export function apiTrainerDetailToUi(t: ApiTrainerDetail): TrainerProfileDetail {
  const facilities = t.facilities
    .map((f) => {
      const label = normalizeFacilityLabel(f.label);
      if (!label) return null;
      return {
        label,
        value: normalizeFacilityValue(f.value, f.available, label),
        available: f.available,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const works = t.works
    .filter((w): w is typeof w & { type: 'audio' | 'video' } =>
      w.type === 'audio' || w.type === 'video'
    )
    .map((w) => ({
      type: w.type,
      title: w.title,
      subtitle: w.subtitle ?? '',
    }));

  return {
    id: t.id,
    name: t.name,
    genres: t.genres,
    locationText: t.locationText,
    heroImage: t.heroImage,
    headline: t.headline.length > 0 ? t.headline : ['편안한 보컬 수업을 제공합니다.'],
    careerLabel: t.careerLabel,
    recommendedFor: t.recommendedFor,
    lessonInfo: t.lessonInfo,
    facilities,
    tags: t.tags,
    lessonApproach: t.lessonApproach,
    education: t.education,
    careers: t.careers,
    extraInfo: t.extraInfo,
    works,
    mediaPhotos: t.mediaPhotos,
    mediaVideos: t.mediaVideos,
    reviews: t.reviews.map((r) => ({
      id: r.id,
      name: r.name,
      region: r.region,
      body: r.body,
      ago: r.ago,
      likes: r.likes,
      dislikes: r.dislikes,
      createdAt: r.createdAt,
    })),
  };
}
