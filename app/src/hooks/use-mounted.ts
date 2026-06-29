'use client';

import { useEffect, useState } from 'react';

/**
 * 클라이언트에서만 true. SSR과 hydration 미스매치를 막을 때 사용.
 *
 *   const mounted = useMounted();
 *   if (!mounted) return null; // skeleton
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
