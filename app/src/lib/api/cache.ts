/**
 * 클라이언트 TTL 캐시 + in-flight dedupe.
 *
 * - 같은 key 로 동시에 여러 곳에서 호출해도 실제 fetch 는 1회 (dedupe).
 * - 성공 응답은 TTL 동안 메모리에 캐시.
 * - AbortSignal 은 "이 호출자가 결과를 기다리지 않겠다"는 뜻으로만 쓰이고,
 *   실제 네트워크 요청은 취소하지 않음 (공유 자원이므로).
 * - StrictMode 개발 모드의 이중 마운트도 자연스럽게 dedupe 됨.
 */

const DEV = process.env.NODE_ENV !== 'production';

type Entry<T> = {
  /** 진행 중 요청. 완료되면 data 로 이동. */
  promise?: Promise<T>;
  data?: T;
  expiresAt: number;
};

const store = new Map<string, Entry<unknown>>();

export async function cachedFetch<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
  signal?: AbortSignal
): Promise<T> {
  if (signal?.aborted) {
    throw new DOMException('The operation was aborted.', 'AbortError');
  }

  const now = Date.now();
  const entry = store.get(key) as Entry<T> | undefined;

  // 1) 신선한 캐시 히트
  if (entry && entry.data !== undefined && entry.expiresAt > now) {
    if (DEV) console.log(`[cache:hit] ${key}`);
    return withAbort(Promise.resolve(entry.data), signal);
  }

  // 2) 진행 중 요청에 붙기 (dedupe)
  if (entry?.promise) {
    if (DEV) console.log(`[cache:dedupe] ${key}`);
    return withAbort(entry.promise, signal);
  }

  // 3) 새 요청 발사
  const start = performance.now();
  const promise = fetcher()
    .then((data) => {
      store.set(key, { data, expiresAt: Date.now() + ttlMs });
      if (DEV) {
        console.log(`[cache:store] ${key} ${Math.round(performance.now() - start)}ms`);
      }
      return data;
    })
    .catch((err) => {
      // 실패 시 캐시에 남기지 않음. 다음 호출은 재시도.
      store.delete(key);
      throw err;
    });

  store.set(key, { promise, expiresAt: 0 });
  return withAbort(promise, signal);
}

/**
 * 캐시 무효화.
 * - string: 정확히 일치하는 key 하나
 * - RegExp: 매칭되는 모든 key
 * - '*': 전체 초기화 (로그아웃 시 등)
 */
export function invalidateCache(target: string | RegExp | '*') {
  if (target === '*') {
    store.clear();
    if (DEV) console.log('[cache:invalidate] *');
    return;
  }
  if (typeof target === 'string') {
    store.delete(target);
    if (DEV) console.log(`[cache:invalidate] ${target}`);
    return;
  }
  const keys: string[] = [];
  store.forEach((_v, k) => {
    if (target.test(k)) keys.push(k);
  });
  keys.forEach((k) => store.delete(k));
  if (DEV && keys.length) console.log(`[cache:invalidate] ${keys.join(', ')}`);
}

/** 캐시가 있는 항목만 직접 갱신 (mutation 후 즉시 반영용). */
export function setCache<T>(key: string, data: T, ttlMs: number) {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

function withAbort<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise;
  return new Promise<T>((resolve, reject) => {
    const abort = () => {
      signal.removeEventListener('abort', abort);
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    };
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener('abort', abort, { once: true });
    promise.then(
      (v) => {
        signal.removeEventListener('abort', abort);
        resolve(v);
      },
      (e) => {
        signal.removeEventListener('abort', abort);
        reject(e);
      }
    );
  });
}
