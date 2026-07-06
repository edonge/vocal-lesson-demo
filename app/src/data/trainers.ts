/**
 * 입점 트레이너 목록 (랜딩 페이지 노출용).
 *
 * 수정 방법
 *  - 트레이너를 추가/수정하려면 아래 배열만 편집하세요.
 *  - 사진은 `app/public/trainers/` 폴더에 넣고 `image`에 경로를 지정합니다.
 *      예) 파일이 public/trainers/jiwoo.jpg 이면  image: '/trainers/jiwoo.jpg'
 *  - `image`를 비워두면 이니셜 기반 그라데이션 플레이스홀더가 자동 표시됩니다.
 */
export type Trainer = {
  id: string;
  /** 이름 또는 활동명 */
  name: string;
  /** 활동 지역 */
  region: string;
  /** 장르 / 목적 태그 */
  tags: string[];
  /** 한 줄 소개 */
  intro: string;
  /** public/trainers/ 내 사진 경로. 비우면 플레이스홀더로 대체됨 */
  image?: string;
};

export const trainers: Trainer[] = [
  {
    id: 'jiwoo',
    name: '지우',
    region: '서울 마포·홍대',
    tags: ['실용음악', '입시', '발성 교정'],
    intro: '기초 발성부터 탄탄하게, 무리 없는 소리를 함께 찾아드려요.',
    image: '', // 예: '/trainers/jiwoo.jpg'
  },
  {
    id: 'haeun',
    name: '하은',
    region: '서울 강남·서초',
    tags: ['취미', 'K-POP', '고음'],
    intro: '노래가 즐거워지는 수업. 부담 없이 시작하고 싶은 분께 추천해요.',
    image: '',
  },
  {
    id: 'minjae',
    name: 'MINJAE',
    region: '서울 성수·건대',
    tags: ['보컬 트레이닝', 'R&B', '녹음'],
    intro: '톤과 그루브를 살리는 디테일한 코칭으로 완성도를 높여드립니다.',
    image: '',
  },
  {
    id: 'seoyeon',
    name: '서연',
    region: '경기 분당·판교',
    tags: ['입시', '뮤지컬', '호흡'],
    intro: '입시·오디션 준비, 목표 곡을 무대에서 소화하도록 이끌어드려요.',
    image: '',
  },
  {
    id: 'doha',
    name: '도하',
    region: '서울 종로·을지로',
    tags: ['취미', '발라드', '스타일링'],
    intro: '내 목소리의 강점을 찾아 나만의 색으로 노래하도록 도와드립니다.',
    image: '',
  },
  {
    id: 'yuna',
    name: 'YUNA',
    region: '인천 송도',
    tags: ['보컬 트레이닝', '팝', '온라인'],
    intro: '온라인 레슨도 가능! 바쁜 일상 속에서도 꾸준히 성장해요.',
    image: '',
  },
];
