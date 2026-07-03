import { UnauthorizedPage } from '@/components/auth/error-page';

export const metadata = {
  title: 'Unauthorized',
};

export default function UnauthorizedRoute() {
  return <UnauthorizedPage />;
}
