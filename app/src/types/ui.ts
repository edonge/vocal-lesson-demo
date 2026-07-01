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
  image: string | null;
  bookmarked?: boolean;
};

export type TrainerProfileDetail = {
  id: string;
  name: string;
  genres: string[];
  locationText: string;
  heroImage: string | null;
  headline: string[];
  careerLabel: string;
  recommendedFor: string[];
  lessonInfo: Array<{ label: string; value: string }>;
  facilities: Array<{
    label: '연습실' | '주차';
    value: '보유' | '미보유' | '가능' | '불가능';
    available: boolean;
  }>;
  tags: string[];
  lessonApproach: string;
  education: Array<{ school: string; major: string }>;
  careers: Array<{ period: string; title: string; detail: string }>;
  extraInfo: string;
  works: Array<{ type: 'audio' | 'video'; title: string; subtitle: string }>;
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
};

export type ChatPreview = {
  id: string;
  name: string;
  meta: string;
  date: string;
  message: string;
  unreadCount: number;
  avatarColor: string;
};

export type ChatMessage = {
  id: string;
  sender: 'trainer' | 'me';
  text: string;
  time: string;
  read?: boolean;
};
