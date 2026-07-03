'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { resolveNavFromPath } from '@/constants/navigation';
import { isCmsRoute, resolveCmsNavFromPath } from '@/features/cms/constants/cms-navigation';
import { isChannelRoute, resolveChannelNavFromPath } from '@/features/channels/constants/channel-navigation';

export function useBreadcrumbs() {
  const pathname = usePathname();

  return useMemo(() => {
    if (isCmsRoute(pathname)) {
      return resolveCmsNavFromPath(pathname);
    }
    if (isChannelRoute(pathname)) {
      return resolveChannelNavFromPath(pathname);
    }
    return resolveNavFromPath(pathname);
  }, [pathname]);
}
