# Voccal — Web MVP

보컬 레슨 플랫폼의 웹 MVP. Flutter 네이티브 앱 개발 전 시장 검증용으로 웹부터 배포한다.

## 기술 스택

| 카테고리 | 선택 | 비고 |
| --- | --- | --- |
| Framework | Next.js 14 (App Router) | RSC 기반, Vercel 배포 최적화 |
| Language | TypeScript | strict |
| Styling | Tailwind CSS | 디자인 토큰은 `tailwind.config.ts` |
| 상태 | Zustand + persist | localStorage 자동 동기화 |
| Backend | Next.js Route Handlers | `src/app/api/**/route.ts` |
| DB/ORM | PostgreSQL + Prisma | Neon Postgres 연결 전제 |
| 폼 | react-hook-form + zod | 입력 검증 |
| 아이콘 | lucide-react | |
| 유틸 | clsx, tailwind-merge, class-variance-authority | `cn()`, variant UI |
| 포맷터 | Prettier (+ tailwindcss 플러그인) | |
| 린터 | ESLint (next/core-web-vitals + prettier) | |

> 모바일 네이티브는 Flutter로 별도 구현 예정. 웹과 네이티브 간 코드 공유는 하지 않는다 (RN/Solito 불사용).

## 시작하기

```bash
cd app
npm install        # 최초 1회
npm run dev        # http://localhost:3000
```

추가 스크립트:

```bash
npm run build       # 프로덕션 빌드
npm run start       # 빌드 결과 서버
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint
npm run format      # Prettier write
npm run format:check
```

## 백엔드 / DB 로컬 설정

1. 환경변수 파일을 만든다.

```bash
cp .env.example .env
```

2. Neon Postgres에서 connection string을 복사해 `.env`에 넣는다.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
SESSION_COOKIE_NAME="dore_session"
SESSION_TTL_DAYS="30"
```

secret 값은 커밋하지 않는다. `.env.example`에는 예시만 둔다.

3. Prisma Client를 생성한다.

```bash
npm run prisma:generate
```

4. migration을 적용한다.

```bash
npm run db:migrate
```

5. 개발용 seed 데이터를 넣는다.

```bash
npm run db:seed
```

6. 로컬 서버를 실행한다.

```bash
npm run dev
```

### Prisma 스크립트

```bash
npm run prisma:generate  # Prisma Client 생성
npm run db:migrate       # prisma migrate dev
npm run db:deploy        # prisma migrate deploy (운영/배포 DB)
npm run db:seed          # 개발용 seed 입력 (dev 계정/테스트 채팅 포함)
npm run db:seed:prod     # 운영용 초기 데이터 입력 (dev 계정/테스트 채팅 제외)
npm run db:studio        # Prisma Studio
```

### API 테스트 예시

서버 실행 후 아래처럼 확인한다.

```bash
curl http://localhost:3000/api/home
curl "http://localhost:3000/api/trainers?district=성동구&sort=recommended"
curl http://localhost:3000/api/trainers/trainer-1
```

`/api/me`, 채팅, 북마크 쓰기 API는 로그인 세션이 필요하다. seed 계정은 아래와 같다.

- ID: `devstudent`
- PW: `password1234`

```bash
curl -X POST -c /tmp/dore-cookie.txt http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"loginId":"devstudent","password":"password1234"}'

curl -b /tmp/dore-cookie.txt http://localhost:3000/api/auth/session
curl -b /tmp/dore-cookie.txt http://localhost:3000/api/me
curl -b /tmp/dore-cookie.txt http://localhost:3000/api/chat-rooms
```

쓰기 API 예시:

```bash
curl -X POST -b /tmp/dore-cookie.txt http://localhost:3000/api/trainers/trainer-1/bookmark
curl -X DELETE -b /tmp/dore-cookie.txt http://localhost:3000/api/trainers/trainer-1/bookmark
curl -X POST -b /tmp/dore-cookie.txt http://localhost:3000/api/chat-rooms \
  -H "Content-Type: application/json" \
  -d '{"trainerId":"trainer-1","firstMessage":"상담 문의드립니다."}'
curl -X POST -b /tmp/dore-cookie.txt http://localhost:3000/api/auth/logout
```

현재 인증은 ID/PW 로그인 후 `HttpOnly` 세션 쿠키(`dore_session`)를 발급하는 방식이다. `src/lib/auth/getCurrentUser.ts`는 쿠키의 세션 토큰을 해시해 `user_sessions`에서 현재 사용자를 찾는다. 공개 API(`/api/home`, `/api/trainers`, `/api/trainers/[id]`)는 비로그인 접근을 허용하고, 보호 API는 세션이 없으면 401을 반환한다.

## 디렉토리 구조

```
src/
├─ app/                    Next.js App Router (라우트 = 파일)
│  ├─ layout.tsx           모바일 셸(.app-shell) 적용 루트 레이아웃
│  ├─ page.tsx             스플래시 / 진입 화면
│  └─ onboarding/          역할 선택 + 수강생/강사 온보딩 라우트
├─ components/
│  ├─ ui/                  버튼·인풋·칩 등 디자인 시스템 프리미티브
│  └─ layout/              TopBar 등 레이아웃 컴포넌트
├─ features/               역할/도메인별 화면 묶음
│  ├─ onboarding/{student,teacher}/
│  ├─ trainer/             강사 탐색·상세
│  ├─ consult/             상담 시작·채팅
│  ├─ student-home/
│  └─ teacher-home/
├─ stores/                 Zustand 스토어 (onboarding, consult)
├─ hooks/                  공용 훅 (useMounted 등)
├─ lib/                    DB client, dev auth, API formatter, cn 등 유틸
├─ mocks/                  데모용 mock 데이터
├─ types/                  공용 타입 정의
└─ styles/                 글로벌 추가 스타일이 필요한 경우만
```

```
prisma/
├─ schema.prisma           PostgreSQL schema
├─ migrations/             SQL migration
└─ seed.ts                 현재 프론트 mock 기반 seed
```

라우트 추가는 `src/app/.../page.tsx`만 만들면 자동 매핑된다.

## 디자인 토큰

`tailwind.config.ts`에 브랜드 컬러/그레이/라운드/그림자/폰패밀리 정의.

- `bg-brand-600` / `text-brand-700` — 메인 액션
- `bg-ink-50 ~ ink-950` — 그레이 스케일
- `max-w-phone` (430px) — 앱 셸 폭
- `rounded-md` (14px) — 카드/입력
- `shadow-card` / `shadow-pop` — 카드/팝업

피그마 토큰이 확정되면 위 값을 갱신한다. 장기적으로 design-token JSON에서 자동 생성도 가능.

## 상태 관리 컨벤션

- 글로벌 영속 상태(`Zustand persist`): onboarding 응답, 상담 내역
- 화면 한정 임시 상태: `useState`
- 서버 데이터는 추후 React Query 또는 RSC fetch 도입 검토

SSR hydration 미스매치를 피하려면 store에서 읽은 값을 렌더 분기에 사용할 때 `useMounted()` 체크 후 사용한다.

## 빌드 및 배포

Vercel 기본 설정으로 바로 배포 가능. 모노레포 형태로 `vocal/app/`이 Next.js 루트.

Vercel Project Settings → **Root Directory** = `app`.

### Vercel 배포 전 체크리스트

- `app/.env`는 git에 포함하지 않는다. 실제 값은 Vercel Project Settings → Environment Variables에만 넣는다.
- Vercel 환경변수에는 `DATABASE_URL`, `SESSION_COOKIE_NAME`, `SESSION_TTL_DAYS`를 설정한다.
- Neon의 pooled PostgreSQL connection string을 `DATABASE_URL`에 넣고, `sslmode=require`를 유지한다.
- Vercel Build Command는 기본적으로 `npm run build`를 사용한다. 현재 build script는 `prisma generate && next build`라서 배포 중 Prisma Client가 생성된다.
- Vercel build 중 `prisma migrate dev`, `npm run db:seed`, `npm run db:seed:prod`를 실행하지 않는다.
- 운영 DB migration은 배포 전에 로컬에서 production `DATABASE_URL`을 설정한 뒤 `npm run db:deploy`로 적용한다. MVP 단계에서는 이 방식이 가장 단순하고 실패 지점이 명확하다.
- 개발용 seed(`npm run db:seed`)는 production DB에 실행하지 않는다.
- 운영용 seed(`npm run db:seed:prod`)는 production 초기 데이터가 필요할 때만 수동 실행한다.
- seed의 개발 계정(`devstudent`)은 production에서 그대로 운영 계정처럼 사용하지 않는다. 데모가 필요하면 별도 데모 계정을 명시적으로 관리한다.

### Vercel 환경변수

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
SESSION_COOKIE_NAME="dore_session"
SESSION_TTL_DAYS="30"
```

`SESSION_COOKIE_NAME`과 `SESSION_TTL_DAYS`는 생략해도 기본값이 적용된다. `DATABASE_URL`은 필수다.

### 운영 migration 정책

MVP에서는 Vercel build command에 migration을 묶지 않는다. 권장 순서는 아래와 같다.

```bash
cd app
npm run prisma:generate
npm run db:deploy
npm run db:seed:prod
npm run build
```

향후 팀/CI가 안정화되면 GitHub Actions에서 `prisma migrate deploy`를 실행하는 방식으로 옮긴다.

### seed 정책

개발용 seed:

```bash
npm run db:seed
```

포함 데이터:

- 장르, 레슨 목적, 시설, 태그 기준 데이터
- 서울 일부 구/동 데이터
- 홈 배너
- 트레이너 프로필과 상세 소개, 작업물, 미디어
- 후기 샘플
- 개발용 계정 `devstudent`
- 테스트 채팅방, 테스트 메시지, 테스트 북마크

운영용 seed:

```bash
npm run db:seed:prod
```

포함 데이터:

- 장르, 레슨 목적, 시설, 태그 기준 데이터
- 서울 일부 구/동 데이터
- 홈 배너
- 트레이너 프로필과 상세 소개, 작업물, 미디어
- 후기 샘플

제외 데이터:

- 개발용 계정 `devstudent`
- 테스트 로그인 계정
- 테스트 채팅방
- 테스트 메시지
- 테스트 북마크
- 테스트 `user_daily_dismissals`

운영용 seed는 같은 데이터를 여러 번 실행해도 중복 생성되지 않도록 upsert와 seed 관계 재생성 방식으로 구성되어 있다. 다만 실제 운영 유저/채팅/북마크는 만들거나 삭제하지 않는다.

### 배포 후 smoke test

배포 URL을 `https://YOUR_DOMAIN`으로 바꿔 확인한다.

```bash
curl https://YOUR_DOMAIN/api/home
curl "https://YOUR_DOMAIN/api/trainers?district=성동구&sort=recommended"
curl https://YOUR_DOMAIN/api/trainers/trainer-1
curl -i https://YOUR_DOMAIN/api/me
```

브라우저에서는 아래 흐름을 확인한다.

- `/home`, `/search`, `/trainers/trainer-1`은 비로그인 접근 가능
- `/my`, `/chat`, `/chat/ego-20260623`, `/onboarding/profile`은 비로그인 시 `/login` 이동
- 로그인 후 `/my`, `/chat` 접근 가능
- 로그아웃 후 보호 API는 401 반환

## 모바일 앱처럼 보기

데스크탑/모바일 양쪽에서 max-width 430px의 앱 셸로 렌더. 향후 데스크탑 전용 와이드 레이아웃이 필요하면 `app/(desktop)` route group으로 분기한다.

## 다음 작업

- 온보딩 6단계 (수강생/강사) 폼 구현
- 강사 mock 데이터 + 강사 상세 페이지
- 상담 시작 + 채팅 라우트
- 강사 대시보드 / 프로필 편집
