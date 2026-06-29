import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind 클래스를 안전하게 합치는 헬퍼.
 *   cn('px-2', condition && 'bg-brand', otherClassName)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
