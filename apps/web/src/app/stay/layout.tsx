import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'TungaOS Guest — Digital Concierge',
  description: 'Room service, concierge, dining, checkout — no app required',
  manifest: '/manifest-guest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TungaOS Guest',
  },
};

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function StayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
