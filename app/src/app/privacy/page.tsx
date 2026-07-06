import type { Metadata } from 'next';
import { mailtoUrl, siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: '개인정보처리방침 — 도레',
  description: '도레 개인정보처리방침',
};

const sections = [
  {
    title: '1. 수집하는 개인정보 항목',
    body: [
      '도레는 보컬 레슨 매칭 상담 및 트레이너 입점 문의를 위해 이름, 연락처, 희망 지역, 레슨 목적, 예산, 상담 내용 등 사용자가 직접 제출한 정보를 수집할 수 있습니다.',
      '서비스 개선 및 문의 응대를 위해 접속 환경, 제출 시각 등 최소한의 이용 기록이 함께 처리될 수 있습니다.',
    ],
  },
  {
    title: '2. 개인정보의 이용 목적',
    body: [
      '수강생에게 적합한 보컬 트레이너를 추천하고 상담 연결을 돕기 위해 개인정보를 이용합니다.',
      '트레이너 입점 문의 검토, 안내 발송, 서비스 운영 및 고객 문의 응대를 위해 개인정보를 이용합니다.',
    ],
  },
  {
    title: '3. 개인정보의 보유 및 이용 기간',
    body: [
      '개인정보는 수집 및 이용 목적이 달성될 때까지 보관하며, 사용자가 삭제를 요청하거나 보관 목적이 사라진 경우 지체 없이 파기합니다.',
      '관계 법령에 따라 보관이 필요한 정보는 해당 법령에서 정한 기간 동안 보관할 수 있습니다.',
    ],
  },
  {
    title: '4. 개인정보의 제3자 제공',
    body: [
      '도레는 원칙적으로 사용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.',
      '다만 수강생과 트레이너 간 상담 연결을 위해 필요한 범위에서, 사용자의 동의를 받은 후 관련 정보를 상대방에게 전달할 수 있습니다.',
    ],
  },
  {
    title: '5. 개인정보 처리 위탁',
    body: [
      '도레는 구글폼 등 외부 도구를 활용해 신청 정보를 받을 수 있으며, 해당 도구의 개인정보 처리 방식은 각 제공사의 정책을 따릅니다.',
      '추가 위탁이 발생하는 경우 본 방침 또는 별도 안내를 통해 고지합니다.',
    ],
  },
  {
    title: '6. 이용자의 권리',
    body: [
      '사용자는 언제든지 본인의 개인정보에 대해 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.',
      '요청은 하단 연락처로 접수할 수 있으며, 도레는 합리적인 기간 내에 필요한 조치를 진행합니다.',
    ],
  },
  {
    title: '7. 개인정보 보호 문의',
    body: [
      `개인정보 관련 문의는 ${siteConfig.email}로 연락해 주세요.`,
      '도레는 개인정보 보호와 관련된 문의 및 요청에 성실히 응답하겠습니다.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f8fbff] text-[#101828]">
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
        <a
          href="/landing"
          className="inline-flex rounded-[10px] border border-[#d8e4ff] bg-white px-4 py-2 text-sm font-bold text-[#1f58e0] transition hover:border-[#8aaeff]"
        >
          도레로 돌아가기
        </a>

        <div className="mt-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2b6cff]">
            Privacy Policy
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-normal text-[#101828] sm:text-5xl">
            개인정보처리방침
          </h1>
          <p className="mt-5 text-base leading-8 text-[#59657a]">
            도레는 사용자의 개인정보를 중요하게 생각하며, 개인정보 보호 관련 법령을
            준수하기 위해 아래와 같이 개인정보를 처리합니다.
          </p>
          <p className="mt-3 text-sm font-bold text-[#667085]">시행일: 2026년 7월 6일</p>
        </div>

        <div className="mt-12 space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[24px] border border-[#d8e4ff] bg-white p-6 shadow-[0_18px_60px_rgba(47,84,150,0.07)]"
            >
              <h2 className="text-xl font-black text-[#101828]">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-[#59657a]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-[24px] bg-[#101828] p-6 text-white">
          <h2 className="text-lg font-black">문의</h2>
          <p className="mt-3 text-sm leading-7 text-[#c9d8ff]">
            개인정보처리방침에 대한 문의는 아래 이메일로 보내주세요.
          </p>
          <a
            href={mailtoUrl}
            className="mt-4 inline-flex font-black text-white underline"
          >
            {siteConfig.email}
          </a>
        </div>
      </main>
    </div>
  );
}
