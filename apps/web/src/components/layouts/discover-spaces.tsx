import Link from 'next/link';

import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

interface DiscoverCardProps {
  href: string;
  title: string;
  description: string;
  imageGradient: string;
}

function DiscoverCard({ href, title, description, imageGradient }: DiscoverCardProps) {
  return (
    <Link
      href={asRoute(href)}
      className="group relative overflow-hidden rounded-tunga shadow-tunga transition hover:shadow-tunga-lg"
    >
      <div className={`aspect-[4/3] ${imageGradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-tunga-navy/90 via-tunga-navy/30 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5">
        <h3 className="font-heading text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/80">{description}</p>
      </div>
    </Link>
  );
}

export function DiscoverSpaces() {
  const spaces = [
    {
      href: PUBLIC_ROUTES.rooms,
      title: 'Rooms & Suites',
      description: 'Comfort meets elegance',
      imageGradient: 'bg-gradient-to-br from-slate-600 to-slate-800',
    },
    {
      href: PUBLIC_ROUTES.dining,
      title: 'Dining',
      description: 'Culinary excellence',
      imageGradient: 'bg-gradient-to-br from-amber-700 to-amber-900',
    },
    {
      href: PUBLIC_ROUTES.meetingsEvents,
      title: 'Meetings & Events',
      description: 'Spaces that inspire',
      imageGradient: 'bg-gradient-to-br from-blue-800 to-indigo-900',
    },
    {
      href: PUBLIC_ROUTES.location,
      title: 'Explore Mumbai',
      description: 'Discover the city',
      imageGradient: 'bg-gradient-to-br from-teal-700 to-cyan-900',
    },
  ];

  return (
    <section className="bg-tunga-grey py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-bold text-tunga-navy md:text-4xl">
          Discover Our Spaces
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          Every corner crafted for comfort, connection, and unforgettable stays.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {spaces.map((space) => (
            <DiscoverCard key={space.href} {...space} />
          ))}
        </div>
      </div>
    </section>
  );
}
