'use client';

import { useCallback, useEffect, useRef } from 'react';

import { io, type Socket } from 'socket.io-client';

import { env } from '@/lib/env';

import type { EventsRealtimeEvent } from '@tungaos/shared';

const WS_URL = env.apiUrl.replace('/api/v1', '');

export function useEventsRealtime(
  hotelId: string | null,

  onEvent?: (event: EventsRealtimeEvent) => void,
): void {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!hotelId || socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/events`, {
      query: { hotelId },

      transports: ['websocket', 'polling'],

      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { hotelId });
    });

    const events: EventsRealtimeEvent['type'][] = [
      'dashboard:update',

      'lead:update',

      'booking:update',

      'hall:availability',

      'task:update',

      'staff:allocation',
    ];

    for (const type of events) {
      socket.on(type, (payload: EventsRealtimeEvent) => onEvent?.(payload));
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
