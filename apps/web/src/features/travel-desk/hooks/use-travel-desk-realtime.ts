'use client';

import { useCallback, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/lib/env';

import type { TmsRealtimeEvent } from '@tungaos/shared';

const WS_URL = env.apiUrl.replace('/api/v1', '');

export function useTravelDeskRealtime(
  hotelId: string | null,
  onEvent?: (event: TmsRealtimeEvent) => void,
): void {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!hotelId || socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/travel-desk`, {
      query: { hotelId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { hotelId });
    });

    const events: TmsRealtimeEvent['type'][] = [
      'dashboard:update',
      'trip:update',
      'dispatch:update',
      'vehicle:location',
      'driver:assigned',
    ];

    for (const type of events) {
      socket.on(type, (payload: TmsRealtimeEvent) => onEvent?.(payload));
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
