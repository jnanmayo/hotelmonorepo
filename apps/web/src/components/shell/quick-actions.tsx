'use client';

import { Plus, X } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { QUICK_ACTIONS } from '@/constants/navigation';
import { asRoute } from '@/lib/navigation';
import { useShellStore } from '@/stores/shell.store';

export function QuickActionsFab() {
  const open = useShellStore((s) => s.quickActionsOpen);
  const toggle = useShellStore((s) => s.toggleQuickActions);

  return (
    <div className="fixed bottom-6 right-6 z-fixed flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-2 flex flex-col gap-1 rounded-lg border bg-card p-2 shadow-floating"
          >
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.id}
                href={asRoute(action.href)}
                onClick={() => toggle()}
                className="rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors hover:bg-muted"
              >
                {action.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-floating"
        onClick={toggle}
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
      >
        {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}
