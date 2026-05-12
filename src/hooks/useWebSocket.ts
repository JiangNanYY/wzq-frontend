import { useEffect, useRef, useCallback, useState } from 'react';
import { RoomMessage } from '../types';

const WS_BASE = 'ws://localhost:8888/ws/room';

export const useWebSocket = (
  roomId: string | null,
  onMessage: (message: RoomMessage) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    if (!roomId || wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(`${WS_BASE}/${roomId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error('Message parse error:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setConnected(false);
      };
    } catch (e) {
      console.error('WebSocket connection failed:', e);
      setConnected(false);
    }
  }, [roomId, onMessage]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setConnected(false);
    }
  }, []);

  const send = useCallback((destination: string, body: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const action = destination.replace(`/app/room/${roomId}/`, '').replace('/', '');
      const payload = { action, ...body };
      wsRef.current.send(JSON.stringify(payload));
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [roomId, connect, disconnect]);

  return { send, connected };
};
