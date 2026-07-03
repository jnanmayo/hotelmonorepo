import { notFound } from 'next/navigation';

import { ChannelSectionShell } from '@/features/channels/components/channel-section-shell';
import { CHANNEL_SECTIONS } from '@/features/channels/constants/channel-navigation';

interface ChannelSectionPageProps {
  params: Promise<{ section: string }>;
}

export async function generateMetadata({ params }: ChannelSectionPageProps) {
  const { section } = await params;
  const config = CHANNEL_SECTIONS[section];
  return { title: config ? `${config.title} — Channel Manager` : 'Channel Manager' };
}

export default async function ChannelSectionPage({ params }: ChannelSectionPageProps) {
  const { section } = await params;
  const config = CHANNEL_SECTIONS[section];
  if (!config) notFound();

  return <ChannelSectionShell sectionKey={section as keyof typeof CHANNEL_SECTIONS} config={config} />;
}
