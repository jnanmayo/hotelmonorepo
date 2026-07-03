import { GuestFolioPage } from '@/features/front-desk/components/folio-and-payments';

export default async function FolioRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GuestFolioPage reservationId={id} />;
}
