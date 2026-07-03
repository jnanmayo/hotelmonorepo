import { GenericListPage } from '@/features/front-desk/components/support-pages';
import { FRONT_DESK_API } from '@/features/front-desk/api/endpoints';

export default function TasksPage() {
  return <GenericListPage title="Front Desk Tasks" endpoint={FRONT_DESK_API.tasks} description="Wake-up calls, taxi, airport pickup & guest requests" />;
}
