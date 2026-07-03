import { notFound } from 'next/navigation';

import { CmsSectionShell } from '@/features/cms/components/cms-section-shell';
import { getCmsSection, isCmsSectionKey } from '@/features/cms/constants/cms-sections';

interface CmsSectionPageProps {
  params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: CmsSectionPageProps) {
  const { section } = await params;
  const config = getCmsSection(section);
  return { title: config ? `${config.title} — Website CMS` : 'Website CMS' };
}

export default async function CmsSectionPage({ params }: CmsSectionPageProps) {
  const { section } = await params;

  if (!isCmsSectionKey(section)) {
    notFound();
  }

  const config = getCmsSection(section)!;
  return <CmsSectionShell config={config} />;
}
