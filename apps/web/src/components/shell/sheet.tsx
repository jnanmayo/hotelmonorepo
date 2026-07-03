'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const sheetVariants = cva(
  'fixed z-modal gap-4 bg-card shadow-dialog transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out',
  {
    variants: {
      side: {
        right: 'inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        left: 'inset-y-0 left-0 h-full w-full max-w-xs border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left lg:max-w-sm',
      },
    },
    defaultVariants: { side: 'right' },
  },
);

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: VariantProps<typeof sheetVariants>['side'];
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Sheet({ open, onOpenChange, side = 'right', title, children, className }: SheetProps) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-modal bg-primary/40 backdrop-blur-sm animate-in fade-in-0"
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-label={title}
        className={cn(sheetVariants({ side }), className)}
      >
        <div className="flex h-full flex-col">
          {title && (
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="font-heading text-lg font-semibold">{title}</h2>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-md p-1 hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
