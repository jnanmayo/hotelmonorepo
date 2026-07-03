'use client';

import { useCallback, useEffect, useRef } from 'react';
import { env } from '@/lib/env';

import type { CommandCenterRealtimeEvent } from '@tungaos/shared';

const WS_URL = env.apiUrl.replace('/api/v1', '');

import { io, type Socket } from 'socket.io-client';

export function useCommandCenterRealtime(
  hotelId: string | null,
  onEvent?: (event: CommandCenterRealtimeEvent) => void,
): void {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (!hotelId || socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/command-center`, {
      query: { hotelId },
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on('connect', () => socket.emit('subscribe', { hotelId }));

    (['dashboard:update', 'revenue:update', 'occupancy:update', 'alert:new'] as const).forEach(
      (type) => {
        socket.on(type, (payload: CommandCenterRealtimeEvent) => onEvent?.(payload));
      },
    );

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
