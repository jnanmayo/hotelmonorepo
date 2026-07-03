import { GenericListPage } from '@/features/front-desk/components/support-pages';
import { FRONT_DESK_API } from '@/features/front-desk/api/endpoints';

export default function LostFoundPage() {
  return <GenericListPage title="Lost & Found" endpoint={FRONT_DESK_API.lostFound} description="Track found items and returns" />;
}
