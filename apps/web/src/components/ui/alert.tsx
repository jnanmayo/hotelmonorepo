import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
} as const;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof icons;
}

export function Alert({ className, variant = 'info', children, ...props }: AlertProps) {
  const Icon = icons[variant];
  const styles = {
    info: 'border-primary/20 bg-primary/5 text-primary',
    success: 'border-green-200 bg-green-50 text-green-800',
    warning: 'border-secondary/30 bg-secondary/10 text-tunga-navy',
    error: 'border-destructive/20 bg-destructive/5 text-destructive',
  };

  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-tunga border p-4 text-sm', styles[variant], className)}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
