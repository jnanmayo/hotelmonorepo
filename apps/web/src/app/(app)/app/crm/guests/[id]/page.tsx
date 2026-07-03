import { PmsGuestProfileView } from '@/features/pms/components/pms-guest-profile';

export const metadata = { title: 'Guest Profile — CRM' };

export default async function GuestProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PmsGuestProfileView guestId={id} />;
}
