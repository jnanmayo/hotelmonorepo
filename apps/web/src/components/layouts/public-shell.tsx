'use client';

import { useState } from 'react';

import { LuxuryFooter } from '@/components/website/luxury-footer';
import { LuxuryHeader } from '@/components/website/luxury-header';
import { FloatingBookButton } from '@/components/website/floating-book-button';
import { WhatsAppWidget } from '@/components/website/whatsapp-widget';
import { LiveChatWidget } from '@/components/website/live-chat-widget';
import type { WebsiteContent } from '@/features/website/types/content.types';
import { usePathname } from 'next/navigation';

interface PublicShellProps {
  children: React.ReactNode;
  content: WebsiteContent;
  transparentHeader?: boolean;
}

export function PublicShell({ children, content, transparentHeader }: PublicShellProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <LuxuryHeader
        activePath={pathname}
        transparent={transparentHeader ?? isHome}
        phone={content.contact.phone}
        mobileOpen={mobileMenuOpen}
        onMobileOpenChange={setMobileMenuOpen}
      />
      <main className="flex-1">{children}</main>
      <LuxuryFooter
        hotelName={content.hotelName}
        tagline={content.tagline}
        poweredBy={content.poweredBy}
        contact={content.contact}
        social={content.social}
      />
      {!mobileMenuOpen && (
        <>
          <FloatingBookButton />
          <WhatsAppWidget phone={content.contact.whatsapp} />
          <LiveChatWidget />
        </>
      )}
    </div>
  );
}
