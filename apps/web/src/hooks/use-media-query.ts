import { useCallback, useEffect, useState } from 'react';

interface UseMediaQueryOptions {
  defaultValue?: boolean;
}

/**
 * Responsive breakpoint hook for conditional rendering.
 */
export function useMediaQuery(query: string, options: UseMediaQueryOptions = {}): boolean {
  const { defaultValue = false } = options;
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;

export function useIsMobile(): boolean {
  return !useMediaQuery(breakpoints.md);
}

export function useIsTablet(): boolean {
  const isMd = useMediaQuery(breakpoints.md);
  const isLg = useMediaQuery(breakpoints.lg);
  return isMd && !isLg;
}

export function useIsDesktop(): boolean {
  return useMediaQuery(breakpoints.lg);
}
