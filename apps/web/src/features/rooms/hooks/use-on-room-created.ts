'use client';

import { useEffect } from 'react';

import { ROOM_CREATED_EVENT } from '@/features/rooms/constants/room-events';

export function useOnRoomCreated(onCreated: () => void) {
  useEffect(() => {
    window.addEventListener(ROOM_CREATED_EVENT, onCreated);
    return () => window.removeEventListener(ROOM_CREATED_EVENT, onCreated);
  }, [onCreated]);
}
