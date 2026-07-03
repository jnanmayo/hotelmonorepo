import { ErrorPage } from '@/components/auth/error-page';
import { AUTH_ROUTES } from '@/constants/routes';

export const metadata = { title: 'Subscription Expired' };

export default function SubscriptionExpiredPage() {
  return (
    <ErrorPage
      code="402"
      title="Subscription Expired"
      description="Your hotel subscription has expired. Please renew to continue using TungaOS."
      primaryAction={{ label: 'Contact Support', href: '/app/support' }}
      secondaryAction={{ label: 'Sign Out', href: AUTH_ROUTES.login }}
    />
  );
}
