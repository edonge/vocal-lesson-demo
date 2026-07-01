import type {
  ApiGender,
  ApiMeResponse,
  ApiSkillLevel,
  UpdateStudentProfilePayload,
} from '@/types/api';
import type { StudentProfile } from '@/types';

/**
 * 서버 enum ↔ UI(한국어) 라벨 매핑.
 * 서버 PATCH 는 양쪽 다 받아주지만, 클라이언트 store 는 한국어 라벨을 SoT 로 사용.
 */
const GENDER_API_TO_STORE: Record<ApiGender, '남성' | '여성' | '선택 안 함'> = {
  male: '남성',
  female: '여성',
  none: '선택 안 함',
};

const SKILL_API_TO_STORE: Record<
  ApiSkillLevel,
  '입문' | '초급' | '중급' | '상급'
> = {
  beginner: '입문',
  basic: '초급',
  intermediate: '중급',
  advanced: '상급',
};

/**
 * `/api/me` 응답 → store 의 student 영역에 적용 가능한 partial.
 *
 * 정책:
 * - 서버에 값이 있는 필드만 patch 키로 포함. (= 서버에 없는 정보를 store 가 덮어쓰지 않음)
 * - region 은 store 의 `regions: [province, district, neighborhood]` 모양에 맞춰 재구성.
 */
export function meToStudentStorePatch(me: ApiMeResponse): Partial<StudentProfile> {
  const patch: Partial<StudentProfile> = {};
  if (me.name) patch.name = me.name;

  const sp = me.studentProfile;
  if (!sp) return patch;

  if (sp.gender) {
    const mapped = GENDER_API_TO_STORE[sp.gender];
    if (mapped) patch.gender = mapped;
  }
  if (typeof sp.birthYear === 'number') {
    patch.birthYear = String(sp.birthYear);
  }
  if (sp.region.district || sp.region.neighborhood) {
    const regions: string[] = ['서울특별시'];
    if (sp.region.district) regions.push(sp.region.district);
    if (sp.region.neighborhood) regions.push(sp.region.neighborhood);
    patch.regions = regions;
  }
  if (sp.skillLevel) {
    const mapped = SKILL_API_TO_STORE[sp.skillLevel];
    if (mapped) patch.skillLevel = mapped;
  }
  if (sp.lessonGoal) patch.goals = [sp.lessonGoal];
  if (sp.genres.length > 0) patch.genres = sp.genres;
  if (sp.admissionMajor) patch.admissionMajor = sp.admissionMajor;

  if (sp.eventDate) {
    const [year, month, day] = sp.eventDate.split('-');
    if (year) patch.eventYear = year;
    if (month) patch.eventMonth = month;
    if (day) patch.eventDay = day;
  }
  if (sp.eventSongName) patch.eventSongName = sp.eventSongName;
  if (sp.auditionDirection) patch.auditionDirection = sp.auditionDirection;
  if (sp.otherLessonDescription) {
    patch.otherLessonDescription = sp.otherLessonDescription;
  }
  if (sp.mainConcern) patch.mainProblems = [sp.mainConcern];
  if (sp.intro) patch.mainProblemDetail = sp.intro;

  return patch;
}

/**
 * Store student → PATCH 페이로드.
 * 빈 문자열/빈 배열은 명시적으로 null/[] 로 전송해 서버 측 정리를 일관되게 한다.
 */
export function studentStoreToUpdatePayload(
  s: StudentProfile
): UpdateStudentProfilePayload {
  const eventDate =
    s.eventYear && s.eventMonth && s.eventDay
      ? `${s.eventYear}-${s.eventMonth.padStart(2, '0')}-${s.eventDay.padStart(2, '0')}`
      : null;

  return {
    name: s.name || undefined,
    gender: s.gender ?? null,
    birthYear: s.birthYear ? Number(s.birthYear) : null,
    district: s.regions[1] || null,
    neighborhood:
      s.regions[2] && s.regions[2] !== '상관없음' ? s.regions[2] : null,
    skillLevel: s.skillLevel ?? null,
    lessonGoal: s.goals[0] ?? null,
    genres: s.genres,
    admissionMajor: s.admissionMajor || null,
    eventDate,
    eventSongName: s.eventSongName || null,
    auditionDirection: s.auditionDirection || null,
    otherLessonDescription: s.otherLessonDescription || null,
    mainConcern: s.mainProblems[0] ?? null,
    intro: s.mainProblemDetail || null,
  };
}

/**
 * /api/me 응답 자체를 UI 헬퍼 형태로 정규화. 화면이 raw API 필드에
 * 직접 접근하지 않도록 한다.
 */
export function deriveMeDisplay(me: ApiMeResponse | null) {
  const sp = me?.studentProfile;
  return {
    name: me?.name ?? null,
    phone: me?.phone ?? null,
    district: sp?.region.district ?? null,
    neighborhood: sp?.region.neighborhood ?? null,
    gender: sp?.gender ? GENDER_API_TO_STORE[sp.gender] : null,
    birthYear: typeof sp?.birthYear === 'number' ? String(sp.birthYear) : null,
    skillLevel: sp?.skillLevel ? SKILL_API_TO_STORE[sp.skillLevel] : null,
    lessonGoal: sp?.lessonGoal ?? null,
    genres: sp?.genres ?? [],
    mainConcern: sp?.mainConcern ?? null,
    intro: sp?.intro ?? null,
    profileCompletionScore: sp?.profileCompletionScore ?? null,
    /** 프로필 완성 모달용 누락 정보 */
    missing: missingProfileFields(sp ?? null),
  };
}

function missingProfileFields(sp: ApiMeResponse['studentProfile']) {
  if (!sp) return ['레슨 지역', '레슨 목표', '출생연도'];
  const items: string[] = [];
  if (!sp.region.district) items.push('레슨 지역');
  if (!sp.lessonGoal) items.push('레슨 목표');
  if (!sp.birthYear) items.push('출생연도');
  return items;
}
