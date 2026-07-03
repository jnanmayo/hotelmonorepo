import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-heading text-7xl font-bold text-primary/15">404</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">Page Not Found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button className="mt-8" asChild>
        <Link href={asRoute(PUBLIC_ROUTES.home)}>Back to Home</Link>
      </Button>
    </div>
  );
}
