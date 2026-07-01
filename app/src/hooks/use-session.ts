'use client';

import { useEffect, useState } from 'react';
import { fetchSession } from '@/lib/api/auth-client';
import type { ApiAuthUser } from '@/types/api';

export function useSession() {
  const [user, setUser] = useState<ApiAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchSession(controller.signal)
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { user, isLoading };
}
