import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dore — 도움을 주는 레슨',
  description: '나에게 맞는 보컬 트레이너를 찾는 가장 쉬운 방법',
  applicationName: 'Dore',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dore',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#2b6cff',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
