'use client';

import Image from 'next/image';
import { useState } from 'react';

import { DEFAULT_HOTEL_IMAGE, resolveImageUrl } from '@/lib/image-url';
import { cn } from '@/lib/utils';

interface WebsiteImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackCategory?: 'room' | 'dining' | 'spa' | 'event' | 'lobby' | 'exterior' | 'default';
}

export function WebsiteImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  fallbackCategory = 'default',
}: WebsiteImageProps) {
  const resolved = resolveImageUrl(src, fallbackCategory);
  const fallback = resolveImageUrl(null, fallbackCategory);
  const [imgSrc, setImgSrc] = useState(resolved);
  const unoptimized = imgSrc.startsWith('http');

  const common = {
    alt,
    className: cn('object-cover', className),
    sizes,
    priority,
    unoptimized,
    onError: () => {
      setImgSrc((current) => (current === fallback ? DEFAULT_HOTEL_IMAGE : fallback));
    },
  };

  if (fill) {
    return <Image src={imgSrc} fill {...common} />;
  }

  return (
    <Image
      src={imgSrc}
      width={width ?? 800}
      height={height ?? 600}
      {...common}
    />
  );
}
