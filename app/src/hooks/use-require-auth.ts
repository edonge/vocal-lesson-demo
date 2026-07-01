'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/use-session';

export function useRequireAuth() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session.isLoading && !session.user) router.replace('/login');
  }, [router, session.isLoading, session.user]);

  return session;
}
