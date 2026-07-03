'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

import { AppFooter } from '@/components/shell/app-footer';
import { AppSidebar } from '@/components/shell/app-sidebar';
import { CmsSidebar } from '@/features/cms/components/cms-sidebar';
import { ChannelSidebar } from '@/features/channels/components/channel-sidebar';
import { isChannelRoute } from '@/features/channels/constants/channel-navigation';
import { isCmsRoute } from '@/features/cms/constants/cms-navigation';
import { CommandPalette } from '@/components/shell/command-palette';
import { NotificationPanel } from '@/components/shell/notification-panel';
import { QuickActionsFab } from '@/components/shell/quick-actions';
import { RightDrawer } from '@/components/shell/right-drawer';
import { SkipNav } from '@/components/shell/skip-nav';
import { TopNavbar } from '@/components/shell/top-navbar';
import { useCommandPaletteShortcut } from '@/hooks/use-keyboard-shortcut';
import { cn } from '@/lib/utils';
import { useShellStore } from '@/stores/shell.store';

interface EnterpriseAppShellProps {
  children: React.ReactNode;
  hotelName?: string;
  userName?: string;
  userInitials?: string;
  userRole?: string;
  className?: string;
}

export function EnterpriseAppShell({
  children,
  hotelName,
  userName,
  userInitials,
  userRole,
  className,
}: EnterpriseAppShellProps) {
  const pathname = usePathname();
  const addRecent = useShellStore((s) => s.addRecentRoute);
  const inCms = isCmsRoute(pathname);
  const inChannels = isChannelRoute(pathname);

  useCommandPaletteShortcut();

  useEffect(() => {
    addRecent(pathname);
  }, [pathname, addRecent]);

  return (
    <div className={cn('flex min-h-screen flex-col bg-background', className)}>
      <SkipNav />
      <div className="flex min-h-0 flex-1">
        {inCms ? <CmsSidebar /> : inChannels ? <ChannelSidebar /> : <AppSidebar />}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar
            hotelName={hotelName}
            userName={userName}
            userInitials={userInitials}
            userRole={userRole}
          />
          <motion.main
            id="main-content"
            key={pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto"
          >
            {children}
          </motion.main>
          <AppFooter />
        </div>
      </div>

      <CommandPalette />
      <NotificationPanel />
      <RightDrawer />
      <QuickActionsFab />
    </div>
  );
}
