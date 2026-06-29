export function formatMonthlyPrice(value: number | null) {
  if (!value) return '상담 후 결정';
  return `₩ ${Math.round(value / 10000)}만/월`;
}

export function formatCareer(years: number) {
  return `경력 ${years}년`;
}

export function formatDateKey(value: Date | null) {
  if (!value) return null;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}.`;
}

export function timeLabel(value: Date) {
  return value.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function daysAgoLabel(value: Date) {
  const diffMs = Date.now() - value.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86_400_000));
  if (diffDays < 1) return '오늘';
  if (diffDays < 30) return `${diffDays}일 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
}
