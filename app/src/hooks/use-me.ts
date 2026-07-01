'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMe } from '@/lib/api/me-client';
import { ApiError } from '@/lib/api/client';
import { meToStudentStorePatch } from '@/lib/adapters/me';
import { useOnboardingStore } from '@/stores/onboarding-store';
import type { ApiMeResponse } from '@/types/api';

type Options = {
  /**
   * `true` 면 응답 도착 시 zustand store 의 student 영역을 서버 값으로 hydrate.
   * 단, store 가 SoT 이고 서버에 보낼 값을 만드는 화면에서는 `false` 로 둔다.
   */
  hydrateStore?: boolean;
};

type State = {
  me: ApiMeResponse | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * 현재 사용자(/api/me) 응답을 가져오는 공용 훅.
 * SoT 는 서버지만, 화면이 즉시 비지 않도록 store 도 fallback 으로 사용 가능.
 */
export function useMe({ hydrateStore = false }: Options = {}) {
  const [state, setState] = useState<State>({
    me: null,
    isLoading: true,
    error: null,
  });
  const hydratedRef = useRef(false);

  const load = useCallback(
    (signal?: AbortSignal) => {
      setState((s) => ({ ...s, isLoading: true }));
      return fetchMe(signal)
        .then((data) => {
          setState({ me: data, isLoading: false, error: null });
          if (hydrateStore) {
            const patch = meToStudentStorePatch(data);
            if (Object.keys(patch).length > 0) {
              useOnboardingStore.getState().updateStudent(patch);
            }
            hydratedRef.current = true;
          }
        })
        .catch((err: unknown) => {
          if (signal?.aborted) return;
          if (err instanceof ApiError && err.status === 401) {
            setState({ me: null, isLoading: false, error: null });
            return;
          }
          setState({
            me: null,
            isLoading: false,
            error: err instanceof Error ? err.message : 'unknown error',
          });
        });
    },
    [hydrateStore]
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return {
    me: state.me,
    isLoading: state.isLoading,
    error: state.error,
    hydrated: hydratedRef.current,
    reload: () => load(),
  };
}
