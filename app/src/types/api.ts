export type ApiBanner = {
  id: string;
  title: string;
  imageUrl: string | null;
  bgColor: string | null;
  linkUrl: string | null;
};

export type ApiTrainerPreview = {
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
  bookmarked: boolean;
};

export type ApiHomeResponse = {
  banners: ApiBanner[];
  dorePick: ApiTrainerPreview[];
  profilePrompt: {
    show: boolean;
    missing: string[];
  };
};

export type ApiTrainerDetail = {
  id: string;
  name: string;
  genres: string[];
  locationText: string;
  heroImage: string;
  headline: string[];
  careerLabel: string;
  recommendedFor: string[];
  lessonInfo: Array<{ label: string; value: string }>;
  facilities: Array<{
    label: string;
    value: string;
    available: boolean;
  }>;
  tags: string[];
  lessonApproach: string;
  education: Array<{ school: string; major: string }>;
  careers: Array<{ period: string; title: string; detail: string }>;
  extraInfo: string;
  works: Array<{ type: 'audio' | 'video' | 'photo' | 'link'; title: string; subtitle: string | null; url: string | null }>;
  mediaPhotos: string[];
  mediaVideos: string[];
  reviews: Array<{
    id: string;
    name: string;
    region: string;
    body: string;
    ago: string;
    likes: number;
    dislikes: number;
    createdAt: string;
  }>;
  bookmarked: boolean;
};

export type ApiChatRoomPreview = {
  id: string;
  trainer: {
    id: string;
    name: string;
    meta: string;
    avatarColor: string;
  };
  lastMessage: string;
  lastMessageAt: string | null;
  unreadCount: number;
};

export type ApiChatMessage = {
  id: string;
  sender: 'trainer' | 'me';
  text: string;
  time: string;
  read: boolean;
};

export type ApiChatRoomDetail = {
  id: string;
  trainer: {
    id: string;
    name: string;
    meta: string;
    intro: string;
    tags: string[];
    career: string;
    reviews: number;
    avatarColor: string;
  };
  dateLabel: string;
  messages: ApiChatMessage[];
};

export type ApiBookmarkResponse = {
  bookmarked: boolean;
};

export type ApiCreateChatRoomResponse = {
  roomId: string;
};

export type ApiChatRoomsListResponse = {
  items: ApiChatRoomPreview[];
};

// ----- /api/me -----

/** 서버 enum 그대로. UI에서 한국어 라벨로 변환은 adapter 가 처리. */
export type ApiGender = 'male' | 'female' | 'none';
export type ApiSkillLevel = 'beginner' | 'basic' | 'intermediate' | 'advanced';

export type ApiStudentProfile = {
  gender: ApiGender | null;
  birthYear: number | null;
  region: {
    district: string | null;
    neighborhood: string | null;
  };
  skillLevel: ApiSkillLevel | null;
  lessonGoal: string | null;
  genres: string[];
  admissionMajor: string | null;
  eventDate: string | null;
  eventSongName: string | null;
  auditionDirection: string | null;
  otherLessonDescription: string | null;
  mainConcern: string | null;
  intro: string | null;
  profileCompletionScore: number;
};

export type ApiMeResponse = {
  id: string | null;
  role: string | null;
  name: string | null;
  phone: string | null;
  studentProfile: ApiStudentProfile | null;
};

/**
 * PATCH 페이로드. 서버는 한국어 라벨도 받아주지만, 호환성을 위해 영문 enum 도 허용.
 * 명시적으로 null 을 보내면 서버에서 해당 필드를 비운다.
 */
export type UpdateStudentProfilePayload = {
  name?: string;
  gender?: '남성' | '여성' | '선택 안 함' | ApiGender | null;
  birthYear?: number | string | null;
  district?: string | null;
  neighborhood?: string | null;
  skillLevel?: '입문' | '초급' | '중급' | '상급' | ApiSkillLevel | null;
  lessonGoal?: string | null;
  genres?: string[];
  admissionMajor?: string | null;
  eventDate?: string | null;
  eventSongName?: string | null;
  auditionDirection?: string | null;
  otherLessonDescription?: string | null;
  mainConcern?: string | null;
  intro?: string | null;
};

export type UpdateStudentProfileResponse = {
  studentProfile: ApiStudentProfile;
};

export type ApiAuthUser = {
  id: string;
  role: string;
  loginId: string | null;
  name: string;
  phone: string | null;
};

export type ApiSessionResponse = {
  user: ApiAuthUser | null;
};

export type AuthLoginPayload = {
  loginId: string;
  password: string;
};

export type AuthSignupPayload = {
  loginId: string;
  password: string;
  name: string;
  phone: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
};
