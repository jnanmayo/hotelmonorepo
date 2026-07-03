import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import { AppProviders } from '@/providers/app-providers';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Tunga International Hotel | Luxury Hotel in BKC Mumbai',
    template: '%s | Tunga International Hotel',
  },
  description: 'Book direct at Tunga International Hotel. Luxury rooms, fine dining, meetings & corporate packages in BKC Mumbai.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tungahotel.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-body antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
