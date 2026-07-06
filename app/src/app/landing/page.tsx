import type { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Music2,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { TrainerContactButton } from '@/components/landing/trainer-contact-modal';
import { cn } from '@/lib/cn';
import { siteConfig, mailtoUrl } from '@/lib/site-config';

export const metadata: Metadata = {
  title: '도레 — 내 조건에 맞는 보컬 트레이너 찾기',
  description:
    '도레는 보컬 레슨을 처음 찾는 사람이 목적, 지역, 예산에 맞는 트레이너를 쉽게 비교하고 연결될 수 있게 돕습니다.',
};

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
};

function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-display text-[22px] font-black tracking-normal text-[#101828]',
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" className="h-9 w-auto" draggable={false} />
      <span>도레</span>
    </span>
  );
}

function LinkButton({ href, children, variant = 'primary', className }: LinkButtonProps) {
  const base =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-[12px] px-5 text-sm font-extrabold tracking-normal transition duration-200 active:translate-y-px';
  const styles =
    variant === 'primary'
      ? 'bg-[#1f58e0] text-white shadow-[0_18px_42px_rgba(31,88,224,0.24)] hover:bg-[#1749bd]'
      : 'border border-[#c9d8ff] bg-white/80 text-[#1f3f8f] hover:border-[#8aaeff] hover:bg-white';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, styles, className)}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2b6cff]">
      {children}
    </p>
  );
}

function SectionIntro({
  label,
  title,
  body,
}: {
  label: string;
  title: React.ReactNode;
  body?: string;
}) {
  return (
    <div className="scroll-reveal max-w-2xl">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="mt-4 text-3xl font-black leading-[1.12] tracking-normal text-[#101828] sm:text-[44px]">
        {title}
      </h2>
      {body ? <p className="mt-5 text-base leading-8 text-[#59657a]">{body}</p> : null}
    </div>
  );
}

function PhotoPlaceholder({
  label,
  src,
  className,
  showCaption = true,
  tone = 'blue',
}: {
  label: string;
  src: string;
  className?: string;
  showCaption?: boolean;
  tone?: 'blue' | 'ice' | 'navy';
}) {
  const tones = {
    blue: 'from-[#dce8ff] via-[#f8fbff] to-[#bcd1ff]',
    ice: 'from-[#eef5ff] via-white to-[#d7e6ff]',
    navy: 'from-[#18305f] via-[#2b6cff] to-[#d9e6ff]',
  };

  return (
    <div
      className={cn(
        'float-card relative overflow-hidden rounded-[24px] border border-white/70 bg-gradient-to-br shadow-[0_28px_80px_rgba(42,85,160,0.16)]',
        tones[tone],
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={label}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,30,68,0.02)_35%,rgba(12,30,68,0.34)_100%)]" />
      {showCaption ? (
        <div className="absolute inset-x-6 bottom-6 rounded-[18px] border border-white/80 bg-white/[0.84] p-4 shadow-[0_18px_45px_rgba(34,68,130,0.16)] backdrop-blur-2xl">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#475467]">
            Dore
          </p>
          <p className="mt-1 text-sm font-black text-[#0b1220]">{label}</p>
        </div>
      ) : null}
    </div>
  );
}

const CHECKPOINTS = [
  {
    icon: SlidersHorizontal,
    title: '조건부터 정리',
    body: '목적, 예산, 지역, 원하는 분위기를 먼저 묻고 비교 기준을 잡습니다.',
  },
  {
    icon: UsersRound,
    title: '30명 풀에서 추천',
    body: '마포 중심 등록 트레이너 풀에서 조건이 맞는 후보를 좁혀 보여줍니다.',
  },
  {
    icon: MessageCircle,
    title: '부담 없는 상담',
    body: '전화 상담, 구글폼 작성, 카톡/당근 상담 등 다양한 상담 형태를 제공합니다.',
  },
];

const FLOWS = [
  ['01', '조건 남기기', '노래 목적, 마포 내 선호 지역, 예산대를 간단히 남깁니다.'],
  ['02', '추천 정리', '도레가 비교하기 쉬운 기준으로 후보를 추려 전달합니다.'],
  ['03', '상담 연결', '수강생과 트레이너가 서로 맞는지 대화로 확인합니다.'],
  ['04', '레슨 시작', '맞는 선생님을 찾았다면 원하는 방식으로 수업을 시작합니다.'],
];

const COMPARE_POINTS = [
  '지역과 이동 거리',
  '수업 목적과 장르',
  '상담 가능 여부',
  '예산대와 수업 방식',
];

export default function LandingPage() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f8fbff] font-sans text-[#101828]">
      <header className="bg-[#f8fbff]/86 sticky top-0 z-40 border-b border-[#d8e4ff] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <a href="#top" aria-label="도레 홈" className="inline-flex items-center gap-2">
            <Wordmark />
          </a>
          <nav className="flex items-center gap-2">
            <TrainerContactButton variant="nav">트레이너 입점</TrainerContactButton>
            <a
              href={siteConfig.customerCtaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-[10px] bg-[#2b6cff] px-4 text-sm font-black text-white shadow-[0_10px_24px_rgba(43,108,255,0.22)] transition hover:bg-[#1f58e0]"
            >
              조건 남기기
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="relative isolate min-h-[calc(100svh-69px)] overflow-hidden border-b border-[#d8e4ff]">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_58%,#ffffff_100%)]" />
          <div className="absolute left-1/2 top-[-18rem] -z-10 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[#dbe8ff] blur-3xl" />

          <div className="mx-auto grid min-h-[calc(100svh-69px)] max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:py-16">
            <div className="scroll-reveal">
              <p className="bg-white/78 inline-flex items-center gap-2 rounded-full border border-[#c9d8ff] px-4 py-2 text-sm font-black text-[#1f3f8f] shadow-[0_12px_32px_rgba(57,99,170,0.08)] backdrop-blur">
                <Music2 className="h-4 w-4 text-[#2b6cff]" aria-hidden="true" />
                맞춤 보컬 레슨 매칭
              </p>
              <h1 className="mt-7 max-w-[790px] text-[44px] font-black leading-[0.98] tracking-normal text-[#101828] sm:text-[72px] lg:text-[84px]">
                나에게 맞는
                <br />
                보컬 선생님을
                <br />더 쉽게.
              </h1>
              <p className="mt-7 max-w-[620px] text-lg leading-8 text-[#475467] sm:text-xl">
                노래 목적, 지역, 예산, 원하는 수업 분위기만 알려주세요.
                <br />
                도레가 조건에 맞는 트레이너를 정리해 비교하기 쉽게 보내드립니다.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <LinkButton href={siteConfig.customerCtaUrl} className="w-full sm:w-auto">
                  내 조건 남기기
                </LinkButton>
                <TrainerContactButton className="w-full sm:w-auto">
                  트레이너로 참여하기
                </TrainerContactButton>
              </div>
            </div>

            <div className="scroll-reveal relative min-h-[520px] lg:min-h-[660px]">
              <PhotoPlaceholder
                label="보컬 레슨 현장 사진"
                src="/landing/hero-lesson.png"
                className="absolute right-0 top-0 h-[58%] w-[72%] [animation-delay:80ms]"
                showCaption={false}
                tone="blue"
              />
              <PhotoPlaceholder
                label="연습실 또는 상담 장면"
                src="/landing/hero-studio.png"
                className="absolute bottom-0 left-0 h-[52%] w-[64%] [animation-delay:180ms]"
                showCaption={false}
                tone="ice"
              />
            </div>
          </div>
        </section>

        <section className="py-28 sm:py-36">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <SectionIntro
              label="For Both Sides"
              title={
                <>
                  <span className="block">수강생에게는 선택 기준을,</span>
                  <span className="block whitespace-nowrap text-[clamp(1.45rem,5.8vw,2.75rem)]">
                    트레이너에게는 맞는 문의를.
                  </span>
                </>
              }
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="float-card rounded-[24px] border border-[#d8e4ff] bg-white p-7 shadow-[0_22px_70px_rgba(47,84,150,0.08)]">
                <p className="text-sm font-black text-[#2b6cff]">수강생</p>
                <h3 className="mt-4 text-2xl font-black leading-tight">
                  어떤 선생님이 맞는지 모를 때
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#59657a]">
                  검색 결과를 오래 뒤지는 대신, 내 목적과 생활권에 맞는 후보를 먼저
                  받아봅니다.
                </p>
              </div>
              <div className="float-card rounded-[24px] border border-[#d8e4ff] bg-[#eef5ff] p-7 shadow-[0_22px_70px_rgba(47,84,150,0.08)] [animation-delay:120ms]">
                <p className="text-sm font-black text-[#1f58e0]">트레이너</p>
                <h3 className="mt-4 text-2xl font-black leading-tight">
                  나와 맞는 수강생을 만나고 싶을 때
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#59657a]">
                  무작위 노출보다 수업 방식, 지역, 강점이 맞는 문의로 연결되는 흐름을
                  만듭니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-28 sm:py-36">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionIntro
              label="How Dore Helps"
              title={
                <>
                  깔끔한 리스트보다 중요한 건,
                  <br />
                  고를 수 있는 기준입니다.
                </>
              }
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {CHECKPOINTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="float-card rounded-[24px] border border-[#d8e4ff] bg-[#f8fbff] p-7"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#e5efff]">
                      <Icon className="h-6 w-6 text-[#2b6cff]" aria-hidden="true" />
                    </div>
                    <h3 className="mt-7 text-xl font-black text-[#101828]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#59657a]">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-28 sm:py-36">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
            <div className="scroll-reveal">
              <SectionLabel>Local First</SectionLabel>
              <h2 className="mt-4 text-3xl font-black leading-[1.12] tracking-normal text-[#101828] sm:text-[44px]">
                지금은 마포부터,
                <br />더 촘촘하게 연결합니다.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#59657a]">
                넓게 보이는 플랫폼보다 실제로 움직일 수 있는 생활권에서 시작합니다. 홍대,
                합정, 망원, 공덕 주변의 수업 선택지를 먼저 정리합니다.
              </p>
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {COMPARE_POINTS.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-2 rounded-[14px] border border-[#d8e4ff] bg-white px-4 py-3 text-sm font-bold text-[#101828]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#2b6cff]" aria-hidden="true" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
            <div className="scroll-reveal grid gap-5 sm:grid-cols-[0.84fr_1fr] sm:items-end">
              <PhotoPlaceholder
                label="마포 연습실 사진"
                src="/landing/mapo-studio.png"
                className="aspect-[4/5]"
                showCaption={false}
                tone="ice"
              />
              <div className="space-y-5">
                <PhotoPlaceholder
                  label="상담 또는 레슨 사진"
                  src="/landing/consulation.png"
                  className="aspect-[5/4] [animation-delay:120ms]"
                  showCaption={false}
                />
                <div className="float-card rounded-[24px] bg-[#101828] p-6 text-white [animation-delay:220ms]">
                  <MapPin className="h-6 w-6 text-[#8aaeff]" aria-hidden="true" />
                  <p className="mt-5 text-sm font-bold text-[#c9d8ff]">현재 커버리지</p>
                  <p className="mt-1 text-4xl font-black">마포</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#101828] py-28 text-white sm:py-36">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.76fr_1.24fr]">
              <div className="scroll-reveal">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8aaeff]">
                  Flow
                </p>
                <h2 className="mt-4 text-3xl font-black leading-[1.12] tracking-normal sm:text-[44px]">
                  신청부터 연결까지,
                  <br />네 단계면 충분합니다.
                </h2>
              </div>
              <ol className="grid gap-4 sm:grid-cols-2">
                {FLOWS.map(([number, title, body]) => (
                  <li
                    key={number}
                    className="float-card rounded-[24px] border border-white/10 bg-white/[0.06] p-7"
                  >
                    <p className="text-sm font-black text-[#8aaeff]">{number}</p>
                    <h3 className="mt-4 text-xl font-black">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#c9d8ff]">{body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-white py-28 sm:py-36">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-8 md:grid-cols-2">
            <div className="float-card rounded-[28px] border border-[#d8e4ff] bg-[#f8fbff] p-8 sm:p-10">
              <Sparkles className="h-7 w-7 text-[#2b6cff]" aria-hidden="true" />
              <p className="mt-8 text-sm font-black text-[#2b6cff]">수강생이라면</p>
              <h2 className="mt-4 text-3xl font-black leading-tight">
                내 조건에 맞는 후보부터 받아보세요.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#59657a]">
                가입이나 결제 전에, 어떤 트레이너가 맞을지 먼저 정리해드립니다.
              </p>
              <LinkButton
                href={siteConfig.customerCtaUrl}
                className="mt-8 w-full sm:w-auto"
              >
                조건 남기기
              </LinkButton>
            </div>
            <div className="float-card rounded-[28px] border border-[#d8e4ff] bg-[#eef5ff] p-8 [animation-delay:120ms] sm:p-10">
              <UsersRound className="h-7 w-7 text-[#1f58e0]" aria-hidden="true" />
              <p className="mt-8 text-sm font-black text-[#1f58e0]">트레이너라면</p>
              <h2 className="mt-4 text-3xl font-black leading-tight">
                마포에서 나와 맞는 수강생을 만나세요.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#59657a]">
                강점과 수업 방식을 잘 이해한 문의가 들어오도록 입점 정보를 정리합니다.
              </p>
              <TrainerContactButton className="mt-8 w-full sm:w-auto">
                입점 문의하기
              </TrainerContactButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d8e4ff] bg-[#f8fbff] py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 text-sm text-[#59657a] sm:flex-row sm:items-start sm:justify-between sm:px-8">
          <div>
            <Wordmark className="text-lg [&_img]:h-12" />
            <p className="mt-2 max-w-md leading-6">
              사람들이 원하는 경험을 가장 쉽게 찾아 연결될 수 있게 하는 플랫폼.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a href={mailtoUrl} className="font-bold transition hover:text-[#101828]">
              {siteConfig.email}
            </a>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold transition hover:text-[#101828]"
            >
              Instagram
            </a>
            <a
              href={siteConfig.privacyUrl}
              className="font-bold transition hover:text-[#101828]"
            >
              개인정보처리방침
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
