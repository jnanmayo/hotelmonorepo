'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { flattenNavigation, QUICK_ACTIONS } from '@/constants/navigation';
import { useFlatNavigation } from '@/hooks/use-navigation';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useShellStore } from '@/stores/shell.store';

export function CommandPalette() {
  const router = useRouter();
  const open = useShellStore((s) => s.commandPaletteOpen);
  const setOpen = useShellStore((s) => s.setCommandPaletteOpen);
  const addRecent = useShellStore((s) => s.addRecentRoute);
  const [query, setQuery] = useState('');
  const nav = useFlatNavigation();

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    const navItems = nav.map((item) => ({
      type: 'nav' as const,
      id: item.id,
      label: item.label,
      href: item.href,
      keywords: item.keywords?.join(' ') ?? '',
    }));
    const actions = QUICK_ACTIONS.map((a) => ({
      type: 'action' as const,
      id: a.id,
      label: a.label,
      href: a.href,
      keywords: a.keywords.join(' '),
    }));
    const all = [...navItems, ...actions, ...flattenNavigation().map((n) => ({
      type: 'nav' as const,
      id: n.id,
      label: n.label,
      href: n.href,
      keywords: n.keywords?.join(' ') ?? '',
    }))];

    const unique = Array.from(new Map(all.map((i) => [i.href, i])).values());

    if (!q) return unique.slice(0, 12);
    return unique.filter(
      (i) => i.label.toLowerCase().includes(q) || i.keywords.toLowerCase().includes(q),
    );
  }, [query, nav]);

  const navigate = (href: string) => {
    addRecent(href);
    setOpen(false);
    setQuery('');
    router.push(asRoute(href));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <div className="relative">
            <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search modules, actions, settings..."
              className="border-0 pl-7 shadow-none focus-visible:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <p className="text-caption">Press Ctrl+K to open · Navigate with Enter</p>
        </DialogHeader>
        <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
          {results.map((item) => (
            <li key={`${item.type}-${item.id}`}>
              <button
                type="button"
                className={cn(
                  'flex w-full items-center rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted',
                )}
                onClick={() => navigate(item.href)}
              >
                <span className="font-medium">{item.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.type === 'action' ? 'Action' : 'Go to'}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">No results found</li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
