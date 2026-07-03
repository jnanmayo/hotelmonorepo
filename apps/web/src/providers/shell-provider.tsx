'use client';

import { usePathname } from 'next/navigation';

/** Initializes shell-level keyboard shortcuts for app routes */
export function ShellProvider({ children }: { children: React.ReactNode }) {
  usePathname();
  return children;
}
