import { redirect } from 'next/navigation';

import { APP_BASE } from '@/constants/navigation';

/** Legacy /dashboard redirect → /app/dashboard */
export default function DashboardRedirect() {
  redirect(`${APP_BASE}/dashboard`);
}
