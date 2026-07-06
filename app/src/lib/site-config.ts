/**
 * 랜딩 페이지의 CTA·연락처 링크 모음.
 *
 * 채널 링크는 아래 값만 교체하면 사이트 전체에 반영됩니다.
 */
export const siteConfig = {
  /** 고객용 CTA: "나에게 맞는 트레이너 추천받기" — 구글폼/오픈채팅 등으로 연결 */
  customerCtaUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSd6FPETZngzIu-VuXNn4OH1eeKVvN3j2wQL-3dA3Xo6C_x0hw/viewform?usp=dialog',

  /** 트레이너용 CTA: "트레이너 입점 문의" — 구글폼/오픈채팅 등으로 연결 */
  trainerCtaUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSd6FPETZngzIu-VuXNn4OH1eeKVvN3j2wQL-3dA3Xo6C_x0hw/viewform?usp=dialog',

  /** 연락 이메일 (푸터에 표시) */
  email: 'contact@dore.kr',

  /** 인스타그램 프로필 URL (푸터에 표시) */
  instagramUrl: 'https://instagram.com/dore.kr_official',

  /** 개인정보처리방침 링크 */
  privacyUrl: '/privacy',
} as const;

/** 이메일 클릭 시 메일 앱을 여는 mailto 링크 */
export const mailtoUrl = `mailto:${siteConfig.email}`;
