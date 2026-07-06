import type { NextResponse } from 'next/server';

const DEV = process.env.NODE_ENV !== 'production';

/**
 * route handler 처리 시간 측정 + 응답 헤더에 `X-Server-Time` 추가.
 * 클라이언트 apiFetch 가 이 헤더를 읽어 로그에 함께 남긴다.
 *
 * 사용법:
 *
 *   export async function GET() {
 *     return withServerTiming('home', async () => {
 *       ...
 *       return NextResponse.json(data);
 *     });
 *   }
 */
export async function withServerTiming(
  label: string,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const start = Date.now();
  try {
    const res = await handler();
    const ms = Date.now() - start;
    res.headers.set('X-Server-Time', String(ms));
    if (DEV) {
      // eslint-disable-next-line no-console
      console.log(`[api:${label}] ${ms}ms`);
    }
    return res;
  } catch (err) {
    if (DEV) {
      const ms = Date.now() - start;
      // eslint-disable-next-line no-console
      console.log(`[api:${label}] ${ms}ms ERROR`);
    }
    throw err;
  }
}
