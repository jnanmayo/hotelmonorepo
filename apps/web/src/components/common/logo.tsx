'use client';

import Link from 'next/link';
import { useState } from 'react';

import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { brand } from '@/theme/tokens';

interface LogoProps {
  variant?: 'full' | 'mark' | 'wordmark';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  showVendor?: boolean;
  inverted?: boolean;
}

const markSizes = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-11 w-11 text-base' };
const textSizes = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' };

export function Logo({
  variant = 'full',
  size = 'md',
  href,
  className,
  showVendor = false,
  inverted = false,
}: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const src = variant === 'mark' ? brand.logoMark : brand.logo;

  const content = (
    <div className={cn('flex items-center gap-3', className)}>
      {variant !== 'wordmark' && (
        <>
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`${brand.name} logo`}
              className={cn('shrink-0 object-contain', markSizes[size], 'w-auto max-w-[48px]')}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={cn(
                'flex shrink-0 items-center justify-center rounded-full bg-secondary font-heading font-bold text-primary',
                markSizes[size],
              )}
              aria-hidden
            >
              T
            </div>
          )}
        </>
      )}
      {variant !== 'mark' && (
        <div className="flex flex-col">
          <span
            className={cn(
              'font-heading font-semibold leading-none tracking-wide',
              textSizes[size],
              inverted ? 'text-white' : 'text-foreground',
            )}
          >
            Tunga<span className="text-secondary">OS</span>
          </span>
          {showVendor && (
            <span
              className={cn(
                'mt-0.5 text-[10px] uppercase tracking-widest',
                inverted ? 'text-white/60' : 'text-muted-foreground',
              )}
            >
              {brand.vendor}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={asRoute(href)} className="inline-flex focus-visible:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
