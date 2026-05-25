export type TrainerReview = {
  author: string;
  text: string;
  rating: number;
};

export type CurriculumStep = { title: string; desc: string };
export type FaqItem = { q: string; a: string };
export type PortfolioType =
  | 'instagram'
  | 'youtube'
  | 'video'
  | 'audio'
  | 'space'
  | 'cover';
export type PortfolioLink = { type: PortfolioType; label: string; url?: string };

export type Trainer = {
  id: string;
  name: string;
  initial: string;
  gradient: [string, string];
  location: string;
  tags: string[];
  target: string[];
  price: number;
  trialPrice: number;
  packagePrice: number;
  package8Price?: number;
  priceVisibility: 'public' | 'consult';
  rating: number;
  reviewCount: number;
  intro: string;            // 한 줄 소개
  bio: string;              // 자기소개 (긴 글)
  teachingPhilosophy: string;
  recommendedFor: string[];
  curriculum: CurriculumStep[];
  lessonMethods: string[];
  portfolioLinks: PortfolioLink[];
  notices: string[];
  faqs: FaqItem[];
  reviews: TrainerReview[];
  lessonMinutes: string;
  experienceYears: number;
};

const DEFAULT_METHODS = ['1:1 개인 레슨', '녹음 피드백 제공', '과제 제공', '체험 수업 가능'];

export const TRAINERS: Trainer[] = [
  {
    id: 't1',
    name: '이서윤',
    initial: '이',
    gradient: ['#0b67ff', '#0a52cc'],
    location: '홍대입구역 도보 5분',
    tags: ['고음', '발성교정', '취미보컬'],
    target: ['취미', '직장인', '완전 초보'],
    price: 50000,
    trialPrice: 30000,
    packagePrice: 180000,
    package8Price: 340000,
    priceVisibility: 'public',
    rating: 4.9,
    reviewCount: 42,
    intro: '목이 쉬지 않는 고음 발성을 알려드려요.',
    bio:
      '저는 취미 보컬과 고음 발성 교정을 주로 지도하고 있습니다. 수강생이 본인의 목소리를 불편해하지 않고 오래 노래할 수 있도록, 무리한 발성보다 안정적인 호흡과 성대 사용을 먼저 잡아드립니다. 수업은 부담 없는 분위기에서 진행하지만 피드백은 정확하게 드리는 편이에요.',
    teachingPhilosophy:
      '좋은 보컬 수업은 수강생이 수업이 끝난 뒤에도 혼자 연습할 수 있게 만드는 것이라고 생각합니다. 그래서 “선생님 앞에서만 잘 부르는” 보컬이 아니라, 연습실과 노래방에서도 안정적으로 부를 수 있도록 발성과 호흡의 원리를 함께 알려드립니다.',
    recommendedFor: [
      '고음에서 목이 막히는 분',
      '노래방에서 안정적으로 부르고 싶은 분',
      '기초 발성을 처음부터 잡고 싶은 분',
      '취미로 편안하게 배우고 싶은 직장인',
    ],
    curriculum: [
      { title: '1회차 — 진단', desc: '현재 음역대와 발성 습관을 진단하고 목표를 설정해요.' },
      { title: '2~3회차 — 기초 다지기', desc: '호흡, 성대 접지, 공명 위치를 단계별로 교정해요.' },
      { title: '4회차~ — 곡 적용', desc: '자주 부르는 곡에 발성 원리를 적용하고 녹음으로 비교해요.' },
      { title: '매 수업', desc: '수업 후 24시간 안에 녹음 피드백과 개인 연습 루틴 제공.' },
    ],
    lessonMethods: ['1:1 개인 레슨', '녹음 피드백 제공', '과제 제공', '연습 루틴 제공', '체험 수업 가능'],
    portfolioLinks: [
      { type: 'instagram', label: '인스타그램 (@vocal_seoyoon)' },
      { type: 'youtube', label: '유튜브 — 발성 교정 강의 모음' },
      { type: 'cover', label: '대표 커버 — 폴킴 ‘모든 날, 모든 순간’' },
      { type: 'space', label: '수업 공간 사진 5장' },
    ],
    notices: [
      '첫 수업 전 자주 부르는 곡 1곡을 준비해주세요.',
      '수업 변경은 하루 전까지 가능합니다.',
      '녹음 피드백은 수업 후 24시간 이내 제공됩니다.',
    ],
    faqs: [
      {
        q: '완전 초보도 가능한가요?',
        a: '네, 악보를 읽지 못해도 수업이 가능합니다. 첫 수업에서는 현재 목소리 상태를 확인하는 것부터 시작합니다.',
      },
      {
        q: '온라인 수업도 가능한가요?',
        a: '네, 줌(Zoom)으로 진행 가능합니다. 다만 발성 교정 초기에는 대면 수업을 더 추천드려요.',
      },
      {
        q: '체험 수업만 받아볼 수 있나요?',
        a: '가능합니다. 체험 수업에서 음역대 측정과 간단한 발성 진단을 받아보실 수 있어요.',
      },
    ],
    reviews: [
      { author: '김O지', text: '고음 낼 때 목이 덜 아파졌어요.', rating: 5 },
      { author: '박O준', text: '설명이 친절하고 연습 방향이 명확했어요.', rating: 5 },
      { author: '최O은', text: '취미로 시작했는데 자신감이 생겼어요.', rating: 4 },
    ],
    lessonMinutes: '50분',
    experienceYears: 7,
  },
  {
    id: 't2',
    name: '강도현',
    initial: '강',
    gradient: ['#111827', '#374151'],
    location: '합정역 도보 3분',
    tags: ['믹스보이스', '락/밴드', '고음'],
    target: ['밴드 보컬', '입시', '취미'],
    price: 60000,
    trialPrice: 35000,
    packagePrice: 220000,
    package8Price: 420000,
    priceVisibility: 'public',
    rating: 4.8,
    reviewCount: 67,
    intro: '밴드/락 보컬 출신, 강한 톤과 안정적인 고음을 잡아드립니다.',
    bio:
      '10년차 밴드 보컬 출신으로, 무대 위에서 안정적으로 노래하려면 무엇이 필요한지 잘 알고 있습니다. 단순히 소리를 크게 내는 것이 아니라, 라이브에서 무너지지 않는 발성을 만드는 데 집중합니다.',
    teachingPhilosophy:
      '발성은 운동입니다. 한 번에 바뀌지 않지만, 올바른 방향으로 꾸준히 훈련하면 누구나 무대에서 자기 목소리를 낼 수 있습니다.',
    recommendedFor: [
      '소리가 작고 힘이 없는 분',
      '락/밴드 보컬을 준비하는 분',
      '실용음악과 입시생',
      '라이브 무대에서 떨리는 분',
    ],
    curriculum: [
      { title: '1단계 — 진단', desc: '음역대 측정과 발성 습관 분석.' },
      { title: '2단계 — 호흡과 코어', desc: '복식호흡과 코어 발성 트레이닝 위주의 훈련.' },
      { title: '3단계 — 곡 분석', desc: '곡 카피와 디테일 분석, 라이브 톤 설계.' },
      { title: '4단계 — 무대 적용', desc: '월 1회 라이브 리허설 무료 진행.' },
    ],
    lessonMethods: ['1:1 개인 레슨', '반주/피아노 활용', '녹음 피드백 제공', '월 1회 무료 리허설'],
    portfolioLinks: [
      { type: 'youtube', label: '유튜브 — 라이브 공연 영상 모음' },
      { type: 'instagram', label: '인스타그램 (@dohyun_vox)' },
      { type: 'video', label: '공연 영상 — 홍대 라이브클럽' },
    ],
    notices: [
      '첫 수업 전 평소 부르는 곡 2곡을 준비해주세요.',
      '수업 시간 변경은 최소 24시간 전까지 가능합니다.',
    ],
    faqs: [
      { q: '밴드 보컬이 아니어도 수업 가능한가요?', a: '물론입니다. 발성 원리는 장르와 무관해서 누구나 적용할 수 있어요.' },
      { q: '입시 합격률은 어떻게 되나요?', a: '최근 3년간 실용음악과 입시 합격률 70% 이상입니다.' },
    ],
    reviews: [
      { author: '이O재', text: '밴드 합주 전에 큰 도움이 됐어요.', rating: 5 },
      { author: '정O혁', text: '발성이 안정되니까 곡이 달라졌어요.', rating: 5 },
    ],
    lessonMinutes: '60분',
    experienceYears: 10,
  },
  {
    id: 't3',
    name: '한지민',
    initial: '한',
    gradient: ['#7c3aed', '#4f46e5'],
    location: '강남역 도보 8분',
    tags: ['발라드', '감정 표현', 'R&B'],
    target: ['취미', '직장인', '오디션'],
    price: 55000,
    trialPrice: 25000,
    packagePrice: 200000,
    priceVisibility: 'public',
    rating: 4.9,
    reviewCount: 38,
    intro: '감정이 묻어나는 발라드, 디테일까지 코칭해드려요.',
    bio:
      '발라드와 R&B를 주로 가르치며, 단순히 음을 정확히 내는 것을 넘어 “이 곡이 왜 이 가사인지”를 함께 분석합니다. 곡 해석과 톤 디자인을 통해 자기만의 색을 만들도록 돕습니다.',
    teachingPhilosophy:
      '감정은 흉내내는 것이 아니라 이해해서 나오는 것입니다. 가사를 정확히 읽고 호흡을 설계하면 감정은 자연스럽게 따라옵니다.',
    recommendedFor: [
      '곡 해석이 어려운 분',
      '감정 표현이 단조로운 분',
      '발라드를 잘 부르고 싶은 분',
      '오디션을 앞두고 곡을 다듬어야 하는 분',
    ],
    curriculum: [
      { title: '1회차', desc: '가사 해석과 곡의 흐름 분석.' },
      { title: '2회차', desc: '호흡 설계와 다이내믹 설정.' },
      { title: '3회차 이후', desc: '톤 디자인과 디테일 카피, 녹음 셀프리뷰.' },
    ],
    lessonMethods: ['1:1 개인 레슨', '녹음 피드백 제공', '수업 영상 녹화', '과제 제공'],
    portfolioLinks: [
      { type: 'youtube', label: '유튜브 — 발라드 커버 영상' },
      { type: 'audio', label: '음원 — 정규 EP "Letter"' },
    ],
    notices: [
      '수업 시 가사 출력본 또는 메모장을 준비해주세요.',
      '수업 영상 녹화는 본인 동의 후에만 진행됩니다.',
    ],
    faqs: [
      { q: '오디션이 임박해도 수업 가능한가요?', a: '네, 단기 집중 코스(2~3회)로도 가능합니다.' },
      { q: '곡 선정도 도와주시나요?', a: '본인 음역대와 스타일에 맞는 곡을 함께 추천해드려요.' },
    ],
    reviews: [
      { author: '윤O아', text: '감정선이 정말 달라졌어요.', rating: 5 },
      { author: '서O우', text: '발라드 한 곡을 완벽히 마스터했어요.', rating: 5 },
    ],
    lessonMinutes: '50분',
    experienceYears: 6,
  },
  {
    id: 't4',
    name: '오민재',
    initial: '오',
    gradient: ['#0ea5e9', '#0369a1'],
    location: '신촌역 도보 6분',
    tags: ['K-pop', '음정/박자', '취미보컬'],
    target: ['취미', '완전 초보', '오디션'],
    price: 45000,
    trialPrice: 20000,
    packagePrice: 160000,
    priceVisibility: 'public',
    rating: 4.7,
    reviewCount: 51,
    intro: 'K-pop 커버를 기초부터 차근차근. 음정/박자 잡아드려요.',
    bio:
      'K-pop 커버를 시작하고 싶지만 “음정·박자가 자꾸 흔들린다”는 분들을 많이 만났습니다. 마디 단위로 끊어서 정확하게 잡아드리는 수업을 합니다.',
    teachingPhilosophy:
      '노래를 잘하기 전에 “정확히” 부르는 게 먼저입니다. 정확함이 쌓이면 자신감과 표현력이 자연스럽게 따라옵니다.',
    recommendedFor: [
      '박자가 자주 흔들리는 분',
      '음정이 불안한 초보자',
      'K-pop 커버를 시작하고 싶은 분',
    ],
    curriculum: [
      { title: '1회차', desc: '음정·박자 진단과 기초 호흡.' },
      { title: '2~3회차', desc: '메트로놈/MR 활용 박자 훈련.' },
      { title: '4회차 이후', desc: '커버곡 마디 단위 피드백.' },
    ],
    lessonMethods: DEFAULT_METHODS,
    portfolioLinks: [
      { type: 'instagram', label: '인스타그램 (@minjae_kpop)' },
      { type: 'cover', label: '대표 커버 — NewJeans ‘Super Shy’' },
    ],
    notices: ['수업 전 듣고 싶은 곡 1~2개를 미리 알려주세요.'],
    faqs: [
      { q: '저처럼 정말 초보도 가능한가요?', a: '네, 50% 이상의 수강생이 처음 노래 수업을 받는 분들이에요.' },
    ],
    reviews: [
      { author: '강O연', text: '박자감이 확실히 잡혔어요.', rating: 5 },
      { author: '임O희', text: '초보에게 진짜 친절합니다.', rating: 5 },
    ],
    lessonMinutes: '50분',
    experienceYears: 4,
  },
  {
    id: 't5',
    name: '문세아',
    initial: '문',
    gradient: ['#f97316', '#c2410c'],
    location: '온라인 전용',
    tags: ['뮤지컬', '발성 교정', '발라드'],
    target: ['입시', '직장인', '오디션'],
    price: 65000,
    trialPrice: 30000,
    packagePrice: 240000,
    package8Price: 460000,
    priceVisibility: 'public',
    rating: 5.0,
    reviewCount: 24,
    intro: '뮤지컬/실용음악과 출신, 음역대 확장 전문.',
    bio:
      '뮤지컬과 실용음악과를 모두 거치며 다양한 발성을 훈련했습니다. 좁은 음역대 안에서만 부르고 있는 분들에게 안전한 방식으로 음역을 넓히는 방법을 알려드립니다.',
    teachingPhilosophy:
      '음역대 확장은 “지르는 훈련”이 아닙니다. 호흡과 후두 위치, 모음 형태를 정밀하게 조율하는 과정입니다.',
    recommendedFor: [
      '음역대를 넓히고 싶은 분',
      '뮤지컬 오디션 준비생',
      '실용음악과 입시생',
    ],
    curriculum: [
      { title: '진단', desc: '음역대 측정과 가성/진성 전환 지점 분석.' },
      { title: '교정', desc: '후두 위치와 모음 형태 조율.' },
      { title: '적용', desc: '실제 곡에 적용하며 음역 확장.' },
    ],
    lessonMethods: ['온라인 레슨 가능', '1:1 개인 레슨', '녹음 피드백 제공', 'PDF 코칭 노트'],
    portfolioLinks: [
      { type: 'youtube', label: '유튜브 — 뮤지컬 넘버 커버' },
      { type: 'video', label: '공연 영상 — 대학로 소극장' },
    ],
    notices: ['온라인 수업은 줌(Zoom)으로 진행됩니다.'],
    faqs: [
      { q: '온라인 수업으로도 발성 교정이 가능한가요?', a: '가능합니다. 다만 첫 진단은 영상 통화로 자세히 확인해요.' },
    ],
    reviews: [
      { author: '백O린', text: '음역대가 한 옥타브 늘었어요.', rating: 5 },
      { author: '조O진', text: '뮤지컬 오디션 합격했어요!', rating: 5 },
    ],
    lessonMinutes: '60분',
    experienceYears: 8,
  },
  {
    id: 't6',
    name: '김태오',
    initial: '김',
    gradient: ['#14b8a6', '#0f766e'],
    location: '성수역 도보 4분',
    tags: ['녹음 디렉팅', 'R&B', '감정 표현'],
    target: ['오디션', '직장인', '밴드 보컬'],
    price: 70000,
    trialPrice: 40000,
    packagePrice: 260000,
    priceVisibility: 'public',
    rating: 4.8,
    reviewCount: 29,
    intro: '녹음실 디렉팅 7년차. 톤과 분위기를 잡아드립니다.',
    bio:
      '녹음실에서 디렉팅을 7년간 해왔습니다. 라이브와는 다른 “녹음 발성”과 마이크 사용법, 그리고 본인만의 톤을 찾는 데 집중합니다.',
    teachingPhilosophy:
      '좋은 녹음은 발성과 감정뿐 아니라 마이크와의 거리, 호흡 타이밍이 함께 어우러져야 완성됩니다.',
    recommendedFor: [
      '곡 녹음을 준비 중인 분',
      'SNS용 커버 영상을 잘 만들고 싶은 분',
      '본인만의 톤을 찾고 싶은 분',
    ],
    curriculum: [
      { title: '진단', desc: '녹음 발성과 라이브 발성 차이 분석.' },
      { title: '훈련', desc: '마이크 활용과 호흡 타이밍 조절.' },
      { title: '적용', desc: '실제 녹음과 셀프 믹싱 기초 교육.' },
    ],
    lessonMethods: ['1:1 개인 레슨', '녹음 피드백 제공', '믹싱 기초 교육', '레슨실 마이크 녹음'],
    portfolioLinks: [
      { type: 'audio', label: '음원 — 프로듀싱 참여 EP' },
      { type: 'instagram', label: '인스타그램 (@taeo_studio)' },
    ],
    notices: ['녹음 수업은 별도 30분 추가 진행 가능합니다.'],
    faqs: [
      { q: '믹싱도 배울 수 있나요?', a: '기초 수준의 믹싱은 함께 다룹니다. 본격 믹싱은 외부 강사를 연결해드려요.' },
    ],
    reviews: [
      { author: '하O민', text: '커버 영상 퀄리티가 달라졌어요.', rating: 5 },
      { author: '권O율', text: '녹음 노하우까지 배웠어요.', rating: 4 },
    ],
    lessonMinutes: '60분',
    experienceYears: 7,
  },
  {
    id: 't7',
    name: '정유나',
    initial: '정',
    gradient: ['#ec4899', '#be185d'],
    location: '잠실역 도보 7분',
    tags: ['취미보컬', '발성 교정', '팝송'],
    target: ['완전 초보', '취미', '직장인'],
    price: 40000,
    trialPrice: 15000,
    packagePrice: 140000,
    priceVisibility: 'public',
    rating: 4.9,
    reviewCount: 88,
    intro: '노래방 실력만 늘리고 싶은 분, 저에게 맡기세요.',
    bio:
      '“잘 부르지 않아도 즐겁게 부르고 싶다”는 분들을 위해 수업합니다. 부담스러운 진단보다 한 곡 한 곡 자신감을 쌓아가는 방식이에요.',
    teachingPhilosophy:
      '취미 보컬에서 가장 중요한 건 “계속 부르고 싶은 마음”입니다. 그걸 깨지 않으면서 실력을 함께 올려요.',
    recommendedFor: [
      '노래방에서 점수를 올리고 싶은 분',
      '완전 초보 직장인',
      '편하게 즐기며 배우고 싶은 분',
    ],
    curriculum: [
      { title: '1주차', desc: '편한 분위기에서 평소 부르는 곡 진단.' },
      { title: '2~4주차', desc: '한 곡을 완전히 마스터하기.' },
      { title: '이후', desc: '곡 레퍼토리를 차곡차곡 쌓아가기.' },
    ],
    lessonMethods: ['1:1 개인 레슨', '편안한 분위기', '체험 수업 가능'],
    portfolioLinks: [
      { type: 'instagram', label: '인스타그램 (@yuna_voice)' },
    ],
    notices: ['수업 분위기를 위해 편한 복장으로 와주세요.'],
    faqs: [
      { q: '회식 자리에서 부를 곡을 단기간에 배울 수 있나요?', a: '가능합니다. 회식 시즌에는 단기 1:1로도 많이 오세요.' },
    ],
    reviews: [
      { author: '구O태', text: '회식 노래방이 안 무서워졌어요.', rating: 5 },
      { author: '진O경', text: '진짜 친절해서 매주 가는게 즐거워요.', rating: 5 },
    ],
    lessonMinutes: '50분',
    experienceYears: 5,
  },
  {
    id: 't8',
    name: '신예준',
    initial: '신',
    gradient: ['#22c55e', '#15803d'],
    location: '홍대입구역 도보 8분',
    tags: ['입시', '음정/박자', '발라드'],
    target: ['입시', '오디션'],
    price: 80000,
    trialPrice: 40000,
    packagePrice: 300000,
    package8Price: 560000,
    priceVisibility: 'consult',
    rating: 4.9,
    reviewCount: 36,
    intro: '실용음악과 입시 합격률 92%. 체계적인 커리큘럼.',
    bio:
      '실용음악과 입시를 중점적으로 지도합니다. 곡 분석부터 시창 청음, 모의 오디션까지 입시에 필요한 모든 단계를 함께합니다.',
    teachingPhilosophy:
      '입시는 짧은 시간 안에 “자기만의 강점”을 보여주는 게임입니다. 정확함과 임팩트, 두 가지를 동시에 훈련합니다.',
    recommendedFor: [
      '실용음악과 입시 준비생',
      '오디션 단기 준비 필요한 분',
      '곡 분석이 어려운 분',
    ],
    curriculum: [
      { title: '진단', desc: '음역대, 시창 청음 수준 확인.' },
      { title: '주 2회 권장', desc: '곡 분석 + 시창 청음 병행.' },
      { title: '분기 1회', desc: '모의 오디션과 영상 피드백.' },
    ],
    lessonMethods: ['1:1 개인 레슨', '시창 청음 병행', '모의 오디션', '녹음 피드백 제공'],
    portfolioLinks: [
      { type: 'youtube', label: '유튜브 — 입시 합격생 인터뷰' },
    ],
    notices: ['입시 시즌에는 마감이 빠릅니다. 미리 문의해주세요.'],
    faqs: [
      { q: '입시까지 6개월 남았는데 가능할까요?', a: '6개월은 충분합니다. 다만 주 2회 이상 권장드려요.' },
    ],
    reviews: [
      { author: '명O빈', text: '체계가 정말 확실해요.', rating: 5 },
      { author: '도O우', text: '서울예대 합격했어요!', rating: 5 },
    ],
    lessonMinutes: '60분',
    experienceYears: 12,
  },
];

export const PORTFOLIO_META: Record<PortfolioType, { icon: string; label: string }> = {
  instagram: { icon: '📸', label: '인스타그램' },
  youtube: { icon: '▶️', label: '유튜브' },
  video: { icon: '🎬', label: '공연 영상' },
  audio: { icon: '🎧', label: '음원' },
  space: { icon: '🏠', label: '수업 공간' },
  cover: { icon: '🎤', label: '대표 커버' },
};
