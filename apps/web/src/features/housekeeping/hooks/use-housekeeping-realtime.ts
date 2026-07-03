'use client';

import { useCallback, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/lib/env';

import type { HkRealtimeEvent } from '@tungaos/shared';

const WS_URL = env.apiUrl.replace('/api/v1', '');

export function useHousekeepingRealtime(
  hotelId: string | null,
  onEvent?: (event: HkRealtimeEvent) => void,
): void {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!hotelId || socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/housekeeping`, {
      query: { hotelId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { hotelId });
    });

    const events: HkRealtimeEvent['type'][] = [
      'task:created',
      'task:updated',
      'task:completed',
      'inspection:pending',
      'inspection:approved',
      'inspection:rejected',
      'room:ready',
      'laundry:update',
      'dashboard:update',
    ];

    for (const type of events) {
      socket.on(type, (payload: HkRealtimeEvent) => onEvent?.(payload));
    }

    socketRef.current = socket;
  }, [hotelId, onEvent]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [connect]);
}
