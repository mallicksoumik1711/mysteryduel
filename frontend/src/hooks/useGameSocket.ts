/**
 * useGameSocket
 * =============
 * Manages the WebSocket connection for a MysteryDuel game room.
 * Composes message processing and action dispatching from dedicated modules.
 */

import { useEffect, useRef, useState } from 'react';
import type {
  ConnectionStatus,
  PendingQuestion,
  GameSocketState,
  GameSocketActions,
} from './gameSocketTypes';
import { getWebSocketBaseUrl, INITIAL_GAME_SOCKET_STATE } from './gameSocketUtils';
import { processSocketMessage } from './gameSocketMessageHandler';
import { useGameSocketActions } from './useGameSocketActions';

export type { ConnectionStatus, PendingQuestion, GameSocketState, GameSocketActions };

export function useGameSocket(
  roomCode: string,
  playerId: string,
): { state: GameSocketState } & GameSocketActions {
  const wsRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<GameSocketState>(INITIAL_GAME_SOCKET_STATE);

  const actions = useGameSocketActions(wsRef, setState);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const wsBase = getWebSocketBaseUrl();
    const url = `${wsBase}/ws/${encodeURIComponent(roomCode)}/${encodeURIComponent(playerId)}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setState((prev) => ({
        ...prev,
        status: 'connected',
        errorMessage: null,
      }));
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const parsed: unknown = JSON.parse(event.data as string);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          return;
        }

        const msg = parsed as Record<string, unknown>;
        setState((prev) => processSocketMessage(msg, playerId, prev));
      } catch {
        // Ignore unparseable frames
      }
    };

    ws.onclose = () => {
      if (wsRef.current === ws) {
        wsRef.current = null;
        setState((prev) => ({
          ...prev,
          status: 'disconnected',
        }));
      }
    };

    ws.onerror = () => {
      setState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: 'WebSocket connection failed',
      }));
    };

    return () => {
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
      ws.close();
    };
  }, [roomCode, playerId]);

  return {
    state,
    ...actions,
  };
}

export default useGameSocket;
