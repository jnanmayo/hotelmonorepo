import { SessionExpiredPage } from '@/components/auth/error-page';

export const metadata = {
  title: 'Session Expired',
};

export default function SessionExpiredRoute() {
  return <SessionExpiredPage />;
}
