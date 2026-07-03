'use client';

import { RefreshCw } from 'lucide-react';

import { Breadcrumb } from '@/components/layouts/breadcrumb';
import { Button } from '@/components/ui/button';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { cn } from '@/lib/utils';

interface AppPageHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  showRefresh?: boolean;
  className?: string;
}

export function AppPageHeader({
  title,
  description,
  actions,
  showRefresh = true,
  className,
}: AppPageHeaderProps) {
  const { breadcrumbs, item } = useBreadcrumbs();
  const pageTitle = title ?? item?.label ?? 'TungaOS';

  return (
    <div className={cn('border-b bg-card px-4 py-5 lg:px-8', className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-h2 truncate">{pageTitle}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {showRefresh && (
            <Button variant="outline" size="sm" aria-label="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
}
