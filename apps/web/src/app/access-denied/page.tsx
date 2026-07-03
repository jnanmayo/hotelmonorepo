import { AccessDeniedPage } from '@/components/auth/error-page';

export const metadata = {
  title: 'Access Denied',
};

export default function AccessDeniedRoute() {
  return <AccessDeniedPage />;
}
