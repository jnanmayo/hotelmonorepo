'use client';

import { ChevronDown, ChevronLeft, ChevronRight, Menu, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Logo } from '@/components/common/logo';
import { Sheet } from '@/components/shell/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { NavItem } from '@/constants/navigation';
import { useNavigation } from '@/hooks/use-navigation';
import { moduleIcons, type ModuleIconKey } from '@/icons/module-icons';
import { asRoute } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useShellStore } from '@/stores/shell.store';
import { useMediaQuery } from '@/hooks/use-media-query';

function NavLink({
  item,
  collapsed,
  depth = 0,
}: {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
}) {
  const pathname = usePathname();
  const favoriteIds = useShellStore((s) => s.favoriteIds);
  const toggleFavorite = useShellStore((s) => s.toggleFavorite);
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = moduleIcons[item.key as ModuleIconKey] ?? moduleIcons.dashboard;
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isFavorite = favoriteIds.includes(item.id);

  const content = (
    <div className={cn('relative', depth > 0 && !collapsed && 'ml-3')}>
      <div className="flex items-center">
        {hasChildren && !collapsed ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className={cn(
              'relative flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'hover:bg-white/5',
              isActive && 'bg-white/10 text-white',
              !isActive && 'text-sidebar-foreground/80',
            )}
          >
            {isActive && (
              <span className="bg-secondary absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full" />
            )}
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            <span className="flex-1 truncate text-left">{item.label}</span>
            {item.badge !== undefined && (
              <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px]">
                {item.badge}
              </Badge>
            )}
            <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
          </button>
        ) : (
          <Link
            href={asRoute(item.href)}
            className={cn(
              'relative flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'hover:bg-white/5',
              isActive && 'bg-white/10 text-white',
              !isActive && 'text-sidebar-foreground/80',
              collapsed && 'justify-center px-2',
            )}
          >
            {isActive && !collapsed && (
              <span className="bg-secondary absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full" />
            )}
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px]">
                    {item.badge}
                  </Badge>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(item.id);
                  }}
                  className="opacity-0 hover:opacity-100 group-hover:opacity-100"
                  aria-label="Toggle favorite"
                >
                  <Star
                    className={cn('h-3.5 w-3.5', isFavorite && 'fill-secondary text-secondary')}
                  />
                </button>
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
              <NavLink key={child.id} item={child} collapsed={collapsed} depth={depth + 1} />
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

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const items = useNavigation();
  const toggleSidebar = useShellStore((s) => s.toggleSidebar);

  return (
    <>
      <div
        className={cn(
          'border-sidebar-border flex h-16 items-center border-b px-4',
          collapsed && 'justify-center',
        )}
      >
        <Logo variant={collapsed ? 'mark' : 'full'} size="sm" inverted showVendor={!collapsed} />
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-0.5 px-3" aria-label="Main navigation" onClick={onNavigate}>
          {items.map((item) => (
            <NavLink key={item.id} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </ScrollArea>
      <div className="border-sidebar-border border-t p-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="text-sidebar-foreground/80 hidden w-full hover:bg-white/5 hover:text-white lg:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </>
  );
}

export function AppSidebar() {
  const collapsed = useShellStore((s) => s.sidebarCollapsed);
  const mobileOpen = useShellStore((s) => s.sidebarMobileOpen);
  const setMobileOpen = useShellStore((s) => s.setSidebarMobileOpen);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile menu button rendered in navbar; sidebar as sheet */}
      {!isDesktop && (
        <Sheet
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          side="left"
          className="bg-sidebar text-sidebar-foreground lg:hidden"
        >
          <div className="flex h-full flex-col">
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </Sheet>
      )}

      {isDesktop && (
        <motion.aside
          animate={{ width: collapsed ? 72 : 256 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="bg-sidebar text-sidebar-foreground relative hidden h-full shrink-0 flex-col lg:flex"
        >
          <SidebarContent collapsed={collapsed} />
        </motion.aside>
      )}
    </TooltipProvider>
  );
}

export function MobileMenuButton() {
  const setMobileOpen = useShellStore((s) => s.setSidebarMobileOpen);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={() => setMobileOpen(true)}
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
