'use client';

import { useCallback, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

import { env } from '@/lib/env';

import type { ProcRealtimeEvent } from '@tungaos/shared';

const WS_URL = env.apiUrl.replace('/api/v1', '');

export function useProcurementRealtime(
  hotelId: string | null,
  onEvent?: (event: ProcRealtimeEvent) => void,
): void {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!hotelId || socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/procurement`, {
      query: { hotelId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { hotelId });
    });

    const events: ProcRealtimeEvent['type'][] = [
      'pr:update',
      'rfq:update',
      'quotation:received',
      'po:update',
      'grn:update',
      'approval:pending',
      'dashboard:update',
      'vendor:notification',
    ];

    for (const type of events) {
      socket.on(type, (payload: ProcRealtimeEvent) => onEvent?.(payload));
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
