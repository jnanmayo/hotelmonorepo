import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

import { Logo } from '@/components/common/logo';
import { FOOTER_LINKS, NAV_LINKS, PUBLIC_ROUTES } from '@/constants/routes';
import type { WebsiteContact, WebsiteSocial } from '@/features/website/types/content.types';
import { asRoute } from '@/lib/navigation';

interface LuxuryFooterProps {
  hotelName: string;
  tagline: string;
  poweredBy: string;
  contact: WebsiteContact;
  social: WebsiteSocial;
}

export function LuxuryFooter({ hotelName, tagline, poweredBy, contact, social }: LuxuryFooterProps) {
  return (
    <footer className="bg-tunga-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo href={PUBLIC_ROUTES.home} size="sm" inverted />
            <p className="mt-4 max-w-sm text-sm text-white/70">{tagline}</p>
            <div className="mt-6 flex gap-3">
              {social.instagram && (
                <SocialLink href={social.instagram} label="Instagram">
                  <Instagram className="h-4 w-4" />
                </SocialLink>
              )}
              {social.facebook && (
                <SocialLink href={social.facebook} label="Facebook">
                  <Facebook className="h-4 w-4" />
                </SocialLink>
              )}
              {social.linkedin && (
                <SocialLink href={social.linkedin} label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </SocialLink>
              )}
            </div>
          </div>

          <FooterColumn title="Quick Links">
            {NAV_LINKS.slice(1, 6).map((link) => (
              <FooterLink key={link.key} href={link.href}>{link.label}</FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Rooms">
            {FOOTER_LINKS.rooms.map((link) => (
              <FooterLink key={link.label} href={link.href}>{link.label}</FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Corporate">
            {FOOTER_LINKS.corporate.map((link) => (
              <FooterLink key={link.label} href={link.href}>{link.label}</FooterLink>
            ))}
            {FOOTER_LINKS.legal.map((link) => (
              <FooterLink key={link.label} href={link.href}>{link.label}</FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-tunga-gold">Address</p>
            <p className="mt-2 text-sm text-white/70">{contact.address}</p>
            <p className="text-sm text-white/70">{contact.city}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-tunga-gold">Contact</p>
            <p className="mt-2">
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-sm text-white/70 hover:text-tunga-gold">
                {contact.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${contact.email}`} className="text-sm text-white/70 hover:text-tunga-gold">
                {contact.email}
              </a>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-tunga-gold">WhatsApp</p>
            <p className="mt-2">
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-tunga-gold"
              >
                Chat with us
              </a>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {hotelName}. All rights reserved.</p>
          <p>Powered by {poweredBy}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-tunga-gold">{title}</p>
      <ul className="mt-4 space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={asRoute(href)} className="text-sm text-white/70 transition hover:text-tunga-gold">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-tunga-gold hover:text-tunga-gold"
    >
      {children}
    </a>
  );
}
