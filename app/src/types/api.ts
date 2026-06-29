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
