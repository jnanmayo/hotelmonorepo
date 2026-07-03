'use client';

import { useEffect, useRef, useCallback, type RefObject } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/lib/env';

import type { FrontDeskRealtimeEvent } from '@tungaos/shared';

const WS_URL = env.apiUrl.replace('/api/v1', '');

export function useFrontDeskRealtime(
  hotelId: string | null,
  onEvent?: (event: FrontDeskRealtimeEvent) => void,
): RefObject<Socket | null> {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!hotelId || socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/front-desk`, {
      query: { hotelId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { hotelId });
    });

    const handlers: FrontDeskRealtimeEvent['type'][] = [
      'arrival:update',
      'departure:update',
      'room:assigned',
      'checkin:complete',
      'checkout:complete',
      'dashboard:update',
      'complaint:new',
      'notification:new',
    ];

    for (const type of handlers) {
      socket.on(type, (payload: FrontDeskRealtimeEvent) => {
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
