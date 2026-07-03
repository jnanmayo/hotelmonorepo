'use client';

import { useEffect, useRef, useCallback, type RefObject } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/lib/env';

import type { PmsRealtimeEvent } from '@tungaos/shared';

const WS_URL = env.apiUrl.replace('/api/v1', '');

export function usePmsRealtime(
  hotelId: string | null,
  onEvent?: (event: PmsRealtimeEvent) => void,
): RefObject<Socket | null> {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!hotelId || socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/pms`, {
      query: { hotelId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { hotelId, channels: ['rooms', 'reservations', 'dashboard'] });
    });

    const handlers: PmsRealtimeEvent['type'][] = [
      'room:status',
      'reservation:update',
      'occupancy:update',
      'dashboard:update',
    ];

    for (const type of handlers) {
      socket.on(type, (payload: PmsRealtimeEvent) => {
        onEvent?.(payload);
      });
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

  return socketRef;
}
