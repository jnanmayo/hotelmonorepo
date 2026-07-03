import { Suspense } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { PageLoader } from '@/components/ui/loader';
import { ChooseRoleForm } from '@/features/auth/components/choose-role-form';

export const metadata = {
  title: 'Select Role',
};

export default function ChooseRolePage() {
  return (
    <AuthShell>
      <Suspense fallback={<PageLoader />}>
        <ChooseRoleForm />
      </Suspense>
    </AuthShell>
  );
}
