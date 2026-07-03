import Image from 'next/image';
import Link from 'next/link';

import { Logo } from '@/components/common/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AUTH_ROUTES, PUBLIC_ROUTES } from '@/constants/routes';
import { DEFAULT_HOTEL_IMAGE } from '@/lib/image-url';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({ title, description, children, footer, className }: AuthCardProps) {
  return (
    <Card className={cn('w-full max-w-md animate-fade-in border border-border/60 bg-card/95 shadow-floating backdrop-blur-xl', className)}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
        {description && <CardDescription className="text-base">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <div className="border-t px-6 pb-6 pt-2 text-center text-sm">{footer}</div>}
    </Card>
  );
}

interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background lg:flex-row">
      <div className="relative hidden flex-1 overflow-hidden lg:flex">
        <Image
          src={DEFAULT_HOTEL_IMAGE}
          alt="TungaOS Hospitality"
          fill
          priority
          className="object-cover"
          sizes="50vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-br from-tunga-navy/90 via-tunga-navy/75 to-black/60" />
        <div className="relative z-10 flex flex-1 flex-col justify-between p-12 text-white">
          <Logo href={PUBLIC_ROUTES.home} inverted showVendor />
          <div className="max-w-lg space-y-6">
            <p className="text-xs font-medium tracking-[0.35em] text-tunga-gold uppercase">TungaOS · Sharada Sama Solutions</p>
            <h1 className="font-heading text-4xl font-semibold leading-tight xl:text-5xl">
              The Digital Brain of Your Hotel
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Enterprise hospitality operations — PMS, finance, CRM, events, fleet, and executive intelligence in one secure platform.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {['Multi-tenant RBAC', 'Real-time ops', 'Executive BI'].map((tag) => (
                <span key={tag} className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-white/50">© Sharada Sama Solutions</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-muted/30 to-background px-4 py-12 sm:px-8">
        <Link href={asRoute(PUBLIC_ROUTES.home)} className="mb-8 lg:hidden">
          <Logo showVendor />
        </Link>
        {children}
      </div>
    </div>
  );
}
