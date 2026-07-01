/**
 * 클라이언트에서 사용하는 API fetch wrapper.
 *
 * 이 파일과 같은 폴더의 다른 `*.ts` 들은 (request.ts, format.ts, trainers.ts, chat.ts)
 * 서버 라우트 핸들러용 헬퍼/Prisma 어댑터다. 이름이 비슷하니 import 시 주의.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiFetchInit = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown> | null;
  searchParams?: URLSearchParams;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

/**
 * 모든 API 호출이 거쳐가는 공용 fetch.
 *
 * - 객체 body는 자동 JSON.stringify
 * - 한글 query는 호출부에서 URLSearchParams 로 전달해야 함 (encode 보장)
 * - 응답이 2xx 아니면 ApiError throw
 */
export async function apiFetch<T>(path: string, init?: ApiFetchInit): Promise<T> {
  const { searchParams, body, headers, ...rest } = init ?? {};
  const query = searchParams ? `?${searchParams.toString()}` : '';
  const url = `${API_BASE}${path}${query}`;

  const isJsonBody = body !== undefined && body !== null && !(body instanceof FormData) && typeof body === 'object';

  const res = await fetch(url, {
    ...rest,
    credentials: rest.credentials ?? 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...(headers ?? {}),
    },
    body: isJsonBody ? JSON.stringify(body) : (body as BodyInit | null | undefined),
  });

  if (!res.ok) {
    let errBody: unknown;
    try {
      errBody = await res.json();
    } catch {
      try {
        errBody = await res.text();
      } catch {
        errBody = undefined;
      }
    }
    const message =
      typeof errBody === 'object' && errBody && 'error' in errBody
        ? String((errBody as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new ApiError(res.status, message, errBody);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
