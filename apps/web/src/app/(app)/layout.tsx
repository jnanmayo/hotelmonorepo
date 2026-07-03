'use client';

import { EnterpriseAppShell } from '@/components/shell/enterprise-app-shell';
import { AppPageHeader } from '@/components/shell/app-page-header';
import { ShellProvider } from '@/providers/shell-provider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <EnterpriseAppShell
        hotelName="Tunga International"
        userName="Hotel Admin"
        userInitials="HA"
        userRole="Hotel Owner"
      >
        <AppPageHeader />
        <div className="ds-page pb-8">{children}</div>
      </EnterpriseAppShell>
    </ShellProvider>
  );
}
