'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/common/logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { moduleIcons, type ModuleIconKey } from '@/icons/module-icons';
import { cn } from '@/lib/utils';
import { asRoute } from '@/lib/navigation';

export interface SidebarNavItem {
  key: ModuleIconKey | string;
  label: string;
  href: string;
  badge?: string | number;
  children?: SidebarNavItem[];
}

interface AppSidebarProps {
  items: SidebarNavItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function AppSidebar({ items, collapsed = false, onToggle, className }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'relative flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64',
          className,
        )}
      >
        <div className={cn('flex h-16 items-center border-b border-sidebar-border px-4', collapsed && 'justify-center')}>
          <Logo variant={collapsed ? 'mark' : 'full'} size="sm" inverted showVendor={!collapsed} />
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3" aria-label="Main navigation">
            {items.map((item) => {
              const Icon = moduleIcons[item.key as ModuleIconKey] ?? moduleIcons.dashboard;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              const link = (
                <Link
                  key={item.href}
                  href={asRoute(item.href)}
                  className={cn(
                    'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                    'hover:bg-white/5',
                    isActive && 'bg-white/10 text-white before:absolute before:left-0 before:top-1/2 before:h-6 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-secondary',
                    !isActive && 'text-sidebar-foreground/80',
                    collapsed && 'justify-center px-2',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px]">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }

              return link;
            })}
          </nav>
        </ScrollArea>

        {onToggle && (
          <div className="border-t border-sidebar-border p-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggle}
              className="w-full text-sidebar-foreground/80 hover:bg-white/5 hover:text-white"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
