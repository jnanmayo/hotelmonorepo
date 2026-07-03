import { redirect } from 'next/navigation';

import { FRONT_DESK_ROUTES } from '@/features/front-desk/api/endpoints';
import { asRoute } from '@/lib/navigation';

export default function LegacyWalkInRedirect() {
  redirect(asRoute(FRONT_DESK_ROUTES.walkIn));
}
