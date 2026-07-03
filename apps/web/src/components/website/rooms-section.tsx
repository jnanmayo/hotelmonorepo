'use client';

import { WebsiteImage } from '@/components/website/website-image';
import Link from 'next/link';
import { Users, Eye } from 'lucide-react';

import { SectionHeader, SectionReveal } from '@/components/website/section-reveal';
import type { RoomItem } from '@/features/website/types/content.types';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

interface RoomsSectionProps {
  rooms: RoomItem[];
  showViewAll?: boolean;
}

export function RoomsSection({ rooms, showViewAll = true }: RoomsSectionProps) {
  return (
    <section className="py-20" aria-labelledby="rooms-heading">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionReveal>
          <SectionHeader
            eyebrow="Accommodations"
            title="Luxury Rooms & Suites"
            subtitle="Elegantly appointed spaces designed for the discerning business and leisure traveler."
          />
        </SectionReveal>
        <div className="grid gap-8 lg:grid-cols-3">
          {rooms.map((room, i) => (
            <SectionReveal key={room.id} delay={i * 0.1}>
              <article className="group overflow-hidden rounded-2xl bg-white shadow-tunga transition hover:shadow-tunga-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <WebsiteImage
                    src={room.imageUrl}
                    alt={room.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    fallbackCategory="room"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tunga-navy/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
                    {room.virtualTourUrl && (
                      <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-tunga-navy">
                        <Eye className="h-3 w-3" /> Virtual Tour
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 id={i === 0 ? 'rooms-heading' : undefined} className="font-heading text-xl font-semibold text-tunga-navy">
                    {room.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{room.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="font-heading text-lg font-semibold text-tunga-navy">
                        ₹{room.priceFrom.toLocaleString('en-IN')}
                        <span className="text-sm font-normal text-muted-foreground"> / night</span>
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {room.occupancy}
                    </span>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {room.amenities.slice(0, 3).map((a) => (
                      <li key={a} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-tunga-navy/80">
                        {a}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex gap-3">
                    <Link
                      href={asRoute(PUBLIC_ROUTES.book)}
                      className="flex-1 rounded-tunga bg-tunga-gold py-2.5 text-center text-xs font-semibold text-tunga-navy transition hover:bg-tunga-navy hover:text-white"
                    >
                      Book Now
                    </Link>
                    <Link
                      href={asRoute(room.href)}
                      className="flex-1 rounded-tunga border border-tunga-navy/20 py-2.5 text-center text-xs font-semibold text-tunga-navy transition hover:border-tunga-gold hover:text-tunga-gold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
        {showViewAll && (
          <SectionReveal className="mt-12 text-center">
            <Link
              href={asRoute(PUBLIC_ROUTES.rooms)}
              className="inline-flex rounded-tunga border border-tunga-navy px-8 py-3 text-sm font-semibold text-tunga-navy transition hover:bg-tunga-navy hover:text-white"
            >
              View All Rooms
            </Link>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}
