'use client';

import { useCallback, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/lib/env';

import type { FinRealtimeEvent } from '@tungaos/shared';

const WS_URL = env.apiUrl.replace('/api/v1', '');

export function useFinanceRealtime(
  hotelId: string | null,
  onEvent?: (event: FinRealtimeEvent) => void,
): void {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!hotelId || socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/finance`, {
      query: { hotelId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { hotelId });
    });

    const events: FinRealtimeEvent['type'][] = [
      'dashboard:update',
      'journal:update',
      'revenue:update',
      'cash:update',
      'approval:pending',
    ];

    for (const type of events) {
      socket.on(type, (payload: FinRealtimeEvent) => onEvent?.(payload));
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
