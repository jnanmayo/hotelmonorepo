'use client';

import { useMemo } from 'react';
import { CHANNEL_NAVIGATION } from '@/features/channels/constants/channel-navigation';

export function useChannelNavigation() {
  return useMemo(() => CHANNEL_NAVIGATION, []);
}
