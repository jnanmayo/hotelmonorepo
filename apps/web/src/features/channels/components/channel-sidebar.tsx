'use client';

import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Radio } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Sheet } from '@/components/shell/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CHANNEL_BASE, type ChannelNavItem } from '@/features/channels/constants/channel-navigation';
import { useChannelNavigation } from '@/features/channels/hooks/use-channel-navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useShellStore } from '@/stores/shell.store';
import { motion } from 'framer-motion';

function ChannelNavLink({ item, collapsed }: { item: ChannelNavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isDashboard = item.href === CHANNEL_BASE;
  const isActive = isDashboard ? pathname === CHANNEL_BASE : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  const link = (
    <Link
      href={asRoute(item.href)}
      className={cn(
        'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        'hover:bg-white/5',
        isActive && 'bg-white/10 text-white',
        !isActive && 'text-sidebar-foreground/80',
        collapsed && 'justify-center px-2',
      )}
    >
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-secondary" />
      )}
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }
  return link;
}

function SidebarInner({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const items = useChannelNavigation();
  const toggleSidebar = useShellStore((s) => s.toggleSidebar);

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 items-center border-b border-sidebar-border px-4 shrink-0', collapsed && 'justify-center')}>
        {!collapsed ? (
          <div className="flex min-w-0 flex-col">
            <Radio className="h-5 w-5 text-secondary" />
            <span className="mt-1 truncate text-[10px] font-medium uppercase tracking-wider text-secondary">
              Channel Manager
            </span>
          </div>
        ) : (
          <Radio className="h-5 w-5 text-secondary" />
        )}
      </div>

      {!collapsed && (
        <div className="border-b border-sidebar-border px-3 py-2 shrink-0">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-sidebar-foreground/70" asChild>
            <Link href={asRoute('/app/dashboard')} onClick={onNavigate}>
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to ERP
            </Link>
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1 min-h-0 py-3">
        <nav className="space-y-0.5 px-3" aria-label="Channel Manager navigation" onClick={onNavigate}>
          {items.map((item) => (
            <ChannelNavLink key={item.id} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </ScrollArea>

      {!collapsed && (
        <div className="border-t border-sidebar-border p-3 shrink-0">
          <Button variant="outline" size="sm" className="w-full gap-2 text-xs" asChild>
            <Link href={asRoute('/app/reservations')}>
              <ExternalLink className="h-3.5 w-3.5" />
              View Reservations
            </Link>
          </Button>
        </div>
      )}

      <div className="border-t border-sidebar-border p-3 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="hidden w-full text-sidebar-foreground/80 hover:bg-white/5 hover:text-white lg:flex"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

export function ChannelSidebar() {
  const collapsed = useShellStore((s) => s.sidebarCollapsed);
  const mobileOpen = useShellStore((s) => s.sidebarMobileOpen);
  const setMobileOpen = useShellStore((s) => s.setSidebarMobileOpen);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <TooltipProvider delayDuration={0}>
      {!isDesktop && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen} side="left" className="bg-sidebar text-sidebar-foreground lg:hidden">
          <div className="flex h-full flex-col">
            <SidebarInner collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </Sheet>
      )}
      {isDesktop && (
        <motion.aside
          animate={{ width: collapsed ? 72 : 256 }}
          transition={{ duration: 0.25 }}
          className="relative hidden h-full shrink-0 flex-col min-h-0 bg-sidebar text-sidebar-foreground lg:flex"
        >
          <SidebarInner collapsed={collapsed} />
        </motion.aside>
      )}
    </TooltipProvider>
  );
}
