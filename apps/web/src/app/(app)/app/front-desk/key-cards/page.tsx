import { GenericListPage } from '@/features/front-desk/components/support-pages';
import { FRONT_DESK_API } from '@/features/front-desk/api/endpoints';

export default function KeyCardsPage() {
  return <GenericListPage title="Key Card Management" endpoint={FRONT_DESK_API.keyCards} description="Issue, duplicate, deactivate & access logs" />;
}
