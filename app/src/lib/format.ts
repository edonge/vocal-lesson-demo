/**
 * 금액을 한국식으로 포맷.
 *   formatKRW(50000) → "50,000원"
 */
export function formatKRW(n: number | null | undefined): string {
  if (n === null || n === undefined) return '-';
  if (n === 0) return '무료';
  return `${n.toLocaleString('ko-KR')}원`;
}

/**
 * ISO 시각을 사람이 읽기 좋은 상대 시각으로.
 *   "15분 전" / "2시간 전" / "1일 전" / 그 이상은 "6/24"
 */
export function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  return d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
}

/**
 * ISO 시각의 시:분.
 */
export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
