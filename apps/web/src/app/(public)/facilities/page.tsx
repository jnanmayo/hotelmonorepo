import { redirect } from 'next/navigation';

import { PUBLIC_ROUTES } from '@/constants/routes';

export default function FacilitiesRedirect() {
  redirect(PUBLIC_ROUTES.amenities);
}
