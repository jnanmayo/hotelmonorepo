import { PmsCalendarView } from '@/features/pms/components/pms-calendar-view';
import { FrontDeskNav } from '@/features/front-desk/components/front-desk-shell';

export default function CalendarPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <FrontDeskNav />
      </div>
      <PmsCalendarView />
    </div>
  );
}
