'use client';

import { useCallback, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/lib/env';

import type { GxpRealtimeEvent } from '@tungaos/shared';

const WS_URL = env.apiUrl.replace('/api/v1', '');

export function useGxpRealtime(
  hotelId: string | null,
  reservationId: string | null,
  onEvent?: (event: GxpRealtimeEvent) => void,
): void {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!hotelId || !reservationId || socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/gxp`, {
      query: { hotelId, reservationId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { hotelId, reservationId });
    });

    const events: GxpRealtimeEvent['type'][] = [
      'request:created',
      'request:updated',
      'order:updated',
      'chat:message',
      'notification:new',
      'checkout:ready',
    ];

    for (const type of events) {
      socket.on(type, (payload: GxpRealtimeEvent) => onEvent?.(payload));
    }

    socketRef.current = socket;
  }, [hotelId, reservationId, onEvent]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [connect]);
}
