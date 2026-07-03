'use client';

import { useEffect } from 'react';

import { useShellStore } from '@/stores/shell.store';

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; meta?: boolean; shift?: boolean } = { ctrl: true },
): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = options.meta ? e.metaKey : options.ctrl !== false ? e.ctrlKey : false;
      if (!mod) return;
      if (options.shift && !e.shiftKey) return;
      if (!options.shift && e.shiftKey) return;
      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, options.ctrl, options.meta, options.shift]);
}

export function useCommandPaletteShortcut(): void {
  const setOpen = useShellStore((s) => s.setCommandPaletteOpen);
  useKeyboardShortcut('k', () => setOpen(true));
}
