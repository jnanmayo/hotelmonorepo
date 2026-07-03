import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary/15 text-primary',
        success: 'border-transparent bg-success/10 text-success',
        warning: 'border-transparent bg-warning/10 text-warning',
        danger: 'border-transparent bg-destructive/10 text-destructive',
        info: 'border-transparent bg-info/10 text-info',
        outline: 'border-border text-foreground',
        vip: 'border-secondary/30 bg-secondary/10 text-secondary-foreground font-semibold',
        corporate: 'border-primary/20 bg-primary/5 text-primary',
        ghost: 'border-transparent bg-muted text-muted-foreground',
        /* Status badges */
        pending: 'border-warning/20 bg-warning/10 text-warning',
        completed: 'border-success/20 bg-success/10 text-success',
        cancelled: 'border-destructive/20 bg-destructive/10 text-destructive',
        occupied: 'border-primary/20 bg-primary/10 text-primary',
        vacant: 'border-success/20 bg-success/10 text-success',
        cleaning: 'border-info/20 bg-info/10 text-info',
        maintenance: 'border-warning/20 bg-warning/10 text-warning',
        new: 'border-secondary bg-secondary text-secondary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
