import Link from 'next/link';

import { asRoute } from '@/lib/navigation';

export function SkipNav() {
  return (
    <Link
      href={asRoute('#main-content')}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      Skip to main content
    </Link>
  );
}
