import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import FloatingSOSButton from '../components/safety/FloatingSOSButton';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Sikkim Yatra — Smart Offline-First Digital Tourism Platform',
  description:
    'Experience the beauty of Sikkim with smart offline-first navigation, permits, cultural guides, and real-time mountain tracking.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
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
  themeColor: '#0f766e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#031e1a] text-[#f0fdf9] antialiased selection:bg-[#0fb49a] selection:text-[#022c22]">
        <Providers>
          {children}
          <FloatingSOSButton />
        </Providers>
      </body>
    </html>
  );
}
