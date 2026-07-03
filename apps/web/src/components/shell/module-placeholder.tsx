import { EmptyState } from '@/components/feedback/empty-state';
import { moduleIcons, type ModuleIconKey } from '@/icons/module-icons';
import { LayoutDashboard } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  description?: string;
  iconKey?: ModuleIconKey | string;
}

export function ModulePlaceholder({
  title,
  description = 'This module will inherit the enterprise application shell. Business logic is not implemented yet.',
  iconKey = 'dashboard',
}: ModulePlaceholderProps) {
  const Icon = moduleIcons[iconKey as ModuleIconKey] ?? LayoutDashboard;

  return (
    <EmptyState
      icon={Icon}
      title={title}
      description={description}
    />
  );
}
