import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, change, changeLabel, icon: Icon, className }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={cn('shadow-card transition-shadow hover:shadow-floating', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/5">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {change !== undefined && (
          <div className="mt-1 flex items-center gap-1.5">
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-success" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
            <span className={cn('text-xs font-medium', isPositive ? 'text-success' : 'text-destructive')}>
              {isPositive ? '+' : ''}
              {change}%
            </span>
            {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface KpiCardProps {
  label: string;
  value: string | number;
  target?: string;
  status?: 'success' | 'warning' | 'danger';
  className?: string;
}

export function KpiCard({ label, value, target, status, className }: KpiCardProps) {
  return (
    <Card className={cn('border-l-4', status === 'success' && 'border-l-success', status === 'warning' && 'border-l-warning', status === 'danger' && 'border-l-destructive', !status && 'border-l-secondary', className)}>
      <CardContent className="p-4">
        <p className="text-caption uppercase tracking-wider">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
        {target && (
          <Badge variant="ghost" className="mt-2">
            Target: {target}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
