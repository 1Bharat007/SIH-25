import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import EnterpriseHeader from '../components/common/EnterpriseHeader';
import FloatingSOSButton from '../components/safety/FloatingSOSButton';
import RealtimeAlertBanner from '../components/disaster/RealtimeAlertBanner';
import AIChatCompanionWidget from '../components/chat/AIChatCompanionWidget';
import OfflineStatusBanner from '../components/offline/OfflineStatusBanner';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Sikkim Yatra — Official Tourism, Safety & Permits Portal',
  description:
    'Official government portal for Sikkim tourism, high-altitude permits, disaster alerts, and authentic cultural heritage.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sikkim Yatra',
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0B3D91',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8F9FA] text-[#202124] antialiased selection:bg-[#E8F0FE] selection:text-[#0B3D91]">
        <Providers>
          <EnterpriseHeader />
          <OfflineStatusBanner />
          <RealtimeAlertBanner />
          {children}
          <FloatingSOSButton />
          <AIChatCompanionWidget />
        </Providers>
      </body>
    </html>
  );
}
