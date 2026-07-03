import { getWebsiteContent } from '@/features/website/services/content.service';
import { PublicShell } from '@/components/layouts/public-shell';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const content = await getWebsiteContent();
  return <PublicShell content={content}>{children}</PublicShell>;
}
