import { ChannelDashboard } from '@/features/channels/components/channel-dashboard';

export const metadata = {
  title: 'Channel Manager',
  description: 'OTA inventory, rate, and booking synchronization',
};

export default function ChannelsPage() {
  return <ChannelDashboard />;
}
