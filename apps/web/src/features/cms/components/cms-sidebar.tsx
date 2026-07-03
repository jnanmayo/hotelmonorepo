'use client';

import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Logo } from '@/components/common/logo';
import { Sheet } from '@/components/shell/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CMS_BASE, type CmsNavItem } from '@/features/cms/constants/cms-navigation';
import { useCmsNavigation } from '@/features/cms/hooks/use-cms-navigation';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useShellStore } from '@/stores/shell.store';
import { useMediaQuery } from '@/hooks/use-media-query';

function CmsNavLink({
  item,
  collapsed,
  depth = 0,
}: {
  item: CmsNavItem;
  collapsed: boolean;
  depth?: number;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;
  const isDashboard = item.href === CMS_BASE;
  const isActive = isDashboard
    ? pathname === CMS_BASE
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const linkClass = cn(
    'relative flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
    'hover:bg-white/5',
    isActive && 'bg-white/10 text-white',
    !isActive && 'text-sidebar-foreground/80',
    collapsed && !hasChildren && 'justify-center px-2',
  );

  const content = (
    <div className={cn('relative', depth > 0 && !collapsed && 'ml-3')}>
      <div className="flex items-center">
        {hasChildren && !collapsed ? (
          <button type="button" onClick={() => setExpanded((e) => !e)} className={linkClass}>
            {isActive && (
              <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-secondary" />
            )}
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="flex-1 truncate text-left">{item.label}</span>
            {item.badge !== undefined && (
              <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px]">
                {item.badge}
              </Badge>
            )}
            <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
          </button>
        ) : (
          <Link href={asRoute(item.href)} className={linkClass}>
            {isActive && !collapsed && (
              <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-secondary" />
            )}
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
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
        )}
      </div>
      <AnimatePresence>
        {hasChildren && expanded && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-l border-white/10 pl-2 pt-1"
          >
            {item.children!.map((child) => (
              <CmsNavLink key={child.id} item={child} collapsed={collapsed} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (collapsed && !hasChildren) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return <div className="group">{content}</div>;
}

function CmsSidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const items = useCmsNavigation();
  const toggleSidebar = useShellStore((s) => s.toggleSidebar);

  return (
    <>
      <div className={cn('flex h-16 items-center border-b border-sidebar-border px-4', collapsed && 'justify-center')}>
        {!collapsed ? (
          <div className="flex min-w-0 flex-col">
            <Logo variant="mark" size="sm" inverted />
            <span className="mt-1 truncate text-[10px] font-medium uppercase tracking-wider text-secondary">
              Website CMS
            </span>
          </div>
        ) : (
          <Globe className="h-5 w-5 text-secondary" />
        )}
      </div>

      {!collapsed && (
        <div className="border-b border-sidebar-border px-3 py-2">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-sidebar-foreground/70" asChild>
            <Link href={asRoute('/app/dashboard')} onClick={onNavigate}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to ERP
            </Link>
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-0.5 px-3" aria-label="CMS navigation" onClick={onNavigate}>
          {items.map((item) => (
            <CmsNavLink key={item.id} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </ScrollArea>

      {!collapsed && (
        <div className="border-t border-sidebar-border p-3">
          <Button variant="outline" size="sm" className="w-full gap-2 text-xs" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Preview Website
            </a>
          </Button>
        </div>
      )}

      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="hidden w-full text-sidebar-foreground/80 hover:bg-white/5 hover:text-white lg:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </>
  );
}

export function CmsSidebar() {
  const collapsed = useShellStore((s) => s.sidebarCollapsed);
  const mobileOpen = useShellStore((s) => s.sidebarMobileOpen);
  const setMobileOpen = useShellStore((s) => s.setSidebarMobileOpen);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <TooltipProvider delayDuration={0}>
      {!isDesktop && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen} side="left" className="bg-sidebar text-sidebar-foreground lg:hidden">
          <div className="flex h-full flex-col">
            <CmsSidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </Sheet>
      )}

      {isDesktop && (
        <motion.aside
          animate={{ width: collapsed ? 72 : 256 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="relative hidden h-full shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex"
        >
          <CmsSidebarContent collapsed={collapsed} />
        </motion.aside>
      )}
    </TooltipProvider>
  );
}
