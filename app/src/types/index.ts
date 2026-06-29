export type Role = 'student' | 'teacher' | null;

export type StudentProfile = {
  name: string;
  gender: '남성' | '여성' | '선택 안 함' | null;
  birthYear: string;
  regions: string[];
  goals: string[];
  genres: string[];
  admissionMajor: string;
  eventYear: string;
  eventMonth: string;
  eventDay: string;
  eventSongName: string;
  auditionDirection: string;
  otherLessonDescription: string;
  skillLevel: '입문' | '초급' | '중급' | '상급' | null;
  mainProblems: string[];
  mainProblemDetail: string;
};

export type PriceVisibility = 'public' | 'consult';

export type CurriculumStep = { title: string; desc: string };
export type FaqItem = { q: string; a: string };

export type PortfolioType =
  | 'instagram'
  | 'youtube'
  | 'video'
  | 'audio'
  | 'space'
  | 'cover';

export type PortfolioLink = {
  type: PortfolioType;
  label: string;
  url: string;
};

export type TeacherProfile = {
  name: string;
  gender: '남성' | '여성' | '선택 안 함' | null;
  photoUploaded: boolean;
  regions: string[];
  targets: string[];
  specialties: string[];
  priceSingle: string;
  pricePackage4: string;
  pricePackage8: string;
  trialProvided: boolean | null;
  trialPrice: string;
  lessonMinutes: '30분' | '50분' | '60분' | '90분' | null;
  priceVisibility: PriceVisibility;
  bio: string;
  aboutMe: string;
  teachingPhilosophy: string;
  recommendedFor: string[];
  curriculum: CurriculumStep[];
  lessonMethods: string[];
  portfolioLinks: PortfolioLink[];
  notices: string[];
  faqs: FaqItem[];
};

export type ConsultStatus =
  | 'new'
  | 'active'
  | 'trialProposed'
  | 'reservationPending'
  | 'reserved'
  | 'closed';

export type ChatMessage = {
  id: string;
  sender: 'student' | 'teacher';
  text: string;
  time: string;
};

export type StudentSummary = {
  name: string;
  goals: string[];
  mainProblems: string[];
  mainProblemDetail?: string;
  genres: string[];
  regions: string[];
  skillLevel: string | null;
  budget?: string | null;
};

export type Consultation = {
  id: string;
  trainerId: string;
  trainerName: string;
  studentId: string;
  studentName: string;
  studentInitial: string;
  studentColor: string;
  status: ConsultStatus;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  unread: { student: number; teacher: number };
  studentSummary: StudentSummary;
  messages: ChatMessage[];
};
