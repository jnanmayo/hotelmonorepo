import { redirect } from 'next/navigation';

import { PUBLIC_ROUTES } from '@/constants/routes';

export default function ExploreRedirect() {
  redirect(PUBLIC_ROUTES.location);
}
