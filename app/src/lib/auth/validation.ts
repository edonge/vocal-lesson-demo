export function normalizeLoginId(loginId: unknown) {
  return typeof loginId === 'string' ? loginId.trim().toLowerCase() : '';
}

export function validateLoginId(loginId: string) {
  if (!/^[a-z0-9_]{4,20}$/.test(loginId)) {
    return '아이디는 영문 소문자, 숫자, _ 조합 4~20자로 입력해주세요.';
  }
  return null;
}

export function validatePassword(password: unknown) {
  if (typeof password !== 'string') return '비밀번호를 입력해주세요.';
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  if (password.length < 8 || !hasLetter || !hasNumber || !hasSpecial) {
    return '비밀번호는 영문, 숫자, 특수문자 조합 8자 이상이어야 합니다.';
  }
  return null;
}

export function sanitizePhone(phone: unknown) {
  return typeof phone === 'string' ? phone.replace(/[^0-9]/g, '') : '';
}
