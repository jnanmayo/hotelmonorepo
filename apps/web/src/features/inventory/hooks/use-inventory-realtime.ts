'use client';

import { useCallback, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/lib/env';

import type { InvRealtimeEvent } from '@tungaos/shared';

const WS_URL = env.apiUrl.replace('/api/v1', '');

export function useInventoryRealtime(
  hotelId: string | null,
  onEvent?: (event: InvRealtimeEvent) => void,
): void {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!hotelId || socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/inventory`, {
      query: { hotelId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { hotelId });
    });

    const events: InvRealtimeEvent['type'][] = [
      'stock:update',
      'consumption:recorded',
      'transfer:update',
      'issue:update',
      'alert:low_stock',
      'alert:expiry',
      'dashboard:update',
      'approval:pending',
    ];

    for (const type of events) {
      socket.on(type, (payload: InvRealtimeEvent) => onEvent?.(payload));
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
