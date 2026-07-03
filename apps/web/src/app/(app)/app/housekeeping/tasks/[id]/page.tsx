import { notFound } from 'next/navigation';

import { HkTaskDetailPage } from '@/features/housekeeping/components/hk-task-detail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: 'Task Detail — Housekeeping' };

export default async function HousekeepingTaskPage({ params }: PageProps) {
  const { id } = await params;
  return <HkTaskDetailPage taskId={id} />;
}
