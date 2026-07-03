import { notFound } from 'next/navigation';

import { CmsSectionShell } from '@/features/cms/components/cms-section-shell';
import { getCmsSection, isCmsSectionKey } from '@/features/cms/constants/cms-sections';

interface CmsSubSectionPageProps {
  params: Promise<{ section: string; rest: string[] }>;
}

export async function generateMetadata({ params }: CmsSubSectionPageProps) {
  const { section, rest } = await params;
  const config = getCmsSection(section);
  const action = rest[0] === 'new' ? 'New' : rest.join(' / ');
  return { title: config ? `${action} — ${config.title}` : 'Website CMS' };
}

export default async function CmsSubSectionPage({ params }: CmsSubSectionPageProps) {
  const { section, rest } = await params;

  if (!isCmsSectionKey(section)) {
    notFound();
  }

  const config = getCmsSection(section)!;
  const subPath = rest[0];

  return <CmsSectionShell config={config} subPath={subPath} />;
}
