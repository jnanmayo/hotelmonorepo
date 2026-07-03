import Link from 'next/link';
import type { Route } from 'next';

import { Button } from '@/components/ui/button';
import { AUTH_ROUTES, PUBLIC_ROUTES } from '@/constants/routes';
import { asRoute } from '@/lib/navigation';

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
  primaryAction?: { label: string; href: Route | string };
  secondaryAction?: { label: string; href: Route | string };
}

export function ErrorPage({
  code,
  title,
  description,
  primaryAction = { label: 'Go to Dashboard', href: '/app/dashboard' },
  secondaryAction = { label: 'Back to Home', href: PUBLIC_ROUTES.home },
}: ErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-heading text-7xl font-bold text-primary/15">{code}</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">{title}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href={asRoute(String(primaryAction.href))}>{primaryAction.label}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={asRoute(String(secondaryAction.href))}>{secondaryAction.label}</Link>
        </Button>
      </div>
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <ErrorPage
      code="401"
      title="Unauthorized"
      description="You need to sign in to access this page."
      primaryAction={{ label: 'Sign In', href: AUTH_ROUTES.login }}
      secondaryAction={{ label: 'Back to Home', href: PUBLIC_ROUTES.home }}
    />
  );
}

export function AccessDeniedPage() {
  return (
    <ErrorPage
      code="403"
      title="Access Denied"
      description="You don't have permission to access this resource. Contact your hotel administrator if you believe this is an error."
      primaryAction={{ label: 'Go to Dashboard', href: '/app/dashboard' }}
    />
  );
}

export function SessionExpiredPage() {
  return (
    <ErrorPage
      code="440"
      title="Session Expired"
      description="Your session has expired for security reasons. Please sign in again to continue."
      primaryAction={{ label: 'Sign In Again', href: AUTH_ROUTES.login }}
    />
  );
}

export function MaintenancePage() {
  return (
    <ErrorPage
      code="503"
      title="Under Maintenance"
      description="TungaOS is temporarily unavailable while we perform scheduled maintenance. Please check back shortly."
      primaryAction={{ label: 'Back to Home', href: PUBLIC_ROUTES.home }}
      secondaryAction={{ label: 'Contact Support', href: PUBLIC_ROUTES.contact }}
    />
  );
}
