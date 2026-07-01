export const HOME_ASSETS = {
  trainer:
    'https://www.figma.com/api/mcp/asset/5a3eefe1-4408-4be7-8622-866af9258907',
  profileModal:
    'https://www.figma.com/api/mcp/asset/71eaeda5-bd20-4abb-8299-0200507171b9',
};

export type HomeBanner = {
  id: string;
  label: string;
  className: string;
};

export const HOME_BANNERS: HomeBanner[] = [
  { id: 'banner-1', label: 'Dore 신규 추천', className: 'bg-blue-500' },
  { id: 'banner-2', label: '내 지역 인기 트레이너', className: 'bg-blue-300' },
  { id: 'banner-3', label: '첫 상담 가이드', className: 'bg-navy-900' },
  { id: 'banner-4', label: '발성 집중 레슨', className: 'bg-green' },
  { id: 'banner-5', label: '이번 주 오픈 클래스', className: 'bg-orange' },
];

export type TrainerPreview = {
  id: string;
  name: string;
  location: string;
  genre: string;
  highlight: string;
  description: string;
  tags: string[];
  career: string;
  reviews: number;
  price: string;
  image: string;
  /** API 응답일 때만 포함. mock fallback 에서는 undefined. */
  bookmarked?: boolean;
};

const trainerSeeds: Array<Omit<TrainerPreview, 'id' | 'image'>> = [
  {
    name: 'ego',
    location: '마포구',
    genre: 'Kpop',
    highlight: '미국에서 다수 Hype!',
    description: '탄탄한 기본기와 섬세한 피드백으로 목소리의 가능성을 끌어올립니다.',
    tags: ['취미', '발성', '고음'],
    career: '경력 10년',
    reviews: 128,
    price: '₩ 35만/월',
  },
  {
    name: 'lia',
    location: '성동구',
    genre: 'R&B',
    highlight: '입시 보컬 코칭 전문',
    description: '호흡과 공명을 차분히 잡아 입시곡의 완성도를 높여드립니다.',
    tags: ['입시', '호흡', 'R&B'],
    career: '경력 8년',
    reviews: 94,
    price: '₩ 32만/월',
  },
  {
    name: 'muse',
    location: '강남구',
    genre: '발라드',
    highlight: '감정 표현 집중 레슨',
    description: '가사 해석부터 프레이징까지 노래의 설득력을 함께 만듭니다.',
    tags: ['발라드', '표현', '취미'],
    career: '경력 7년',
    reviews: 73,
    price: '₩ 30만/월',
  },
  {
    name: 'june',
    location: '홍대입구',
    genre: 'Pop',
    highlight: '커버 녹음 경험 다수',
    description: '녹음과 라이브 모두에서 안정적인 톤을 낼 수 있도록 돕습니다.',
    tags: ['팝송', '녹음', '톤'],
    career: '경력 9년',
    reviews: 116,
    price: '₩ 34만/월',
  },
  {
    name: 'noah',
    location: '송파구',
    genre: '뮤지컬',
    highlight: '무대 발성 전문',
    description: '대사와 노래가 자연스럽게 이어지는 무대형 발성을 훈련합니다.',
    tags: ['뮤지컬', '발성', '무대'],
    career: '경력 11년',
    reviews: 151,
    price: '₩ 38만/월',
  },
  {
    name: 'arin',
    location: '서초구',
    genre: 'Kpop',
    highlight: '오디션 대비 루틴 제공',
    description: '짧은 시간 안에 강점이 드러나는 오디션 곡 완성도를 높입니다.',
    tags: ['오디션', 'Kpop', '고음'],
    career: '경력 6년',
    reviews: 67,
    price: '₩ 29만/월',
  },
  {
    name: 'rio',
    location: '합정',
    genre: 'Indie',
    highlight: '싱어송라이터 맞춤',
    description: '자작곡의 분위기를 살리는 보컬 톤과 녹음 디렉팅을 제공합니다.',
    tags: ['인디', '녹음', '톤'],
    career: '경력 10년',
    reviews: 132,
    price: '₩ 36만/월',
  },
  {
    name: 'sian',
    location: '용산구',
    genre: 'Rock',
    highlight: '밴드 보컬 트레이닝',
    description: '강한 사운드 속에서도 묻히지 않는 발성과 체력을 함께 만듭니다.',
    tags: ['락/밴드', '파워', '호흡'],
    career: '경력 12년',
    reviews: 108,
    price: '₩ 37만/월',
  },
  {
    name: 'dawn',
    location: '강서구',
    genre: '발라드',
    highlight: '초보자 친화 커리큘럼',
    description: '처음 시작하는 분도 부담 없이 따라올 수 있게 단계별로 안내합니다.',
    tags: ['입문', '취미', '발성'],
    career: '경력 5년',
    reviews: 58,
    price: '₩ 25만/월',
  },
  {
    name: 'ego',
    location: '마포구',
    genre: 'Kpop',
    highlight: '미국에서 다수 Hype!',
    description: '탄탄한 기본기와 섬세한 피드백으로 목소리의 가능성을 끌어올립니다.',
    tags: ['취미', '발성', '고음'],
    career: '경력 10년',
    reviews: 128,
    price: '₩ 35만/월',
  },
];

export const DORE_PICK_TRAINERS: TrainerPreview[] = trainerSeeds
  .slice(0, 10)
  .map((trainer, index) => ({
    ...trainer,
    id: `trainer-${index + 1}`,
    image: HOME_ASSETS.trainer,
  }));
