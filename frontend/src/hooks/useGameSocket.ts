/**
 * useGameSocket
 * =============
 * Manages the WebSocket connection for a MysteryDuel game room.
 *
 * Connection URL: ws://localhost:8000/ws/{roomCode}/{playerId}
 *
 * Inbound message types the hook handles:
 *   joined              – confirms own connection, tells you if it's your turn
 *   opponent_joined     – opponent entered the room
 *   game_start          – both players are in; game begins
 *   question_received   – opponent asked you a question; you must answer Yes/No
 *   question_sent       – your question was delivered (waiting for answer)
 *   answer_received     – an exchange completed; carry the resolved log entry
 *   opponent_disconnected
 *   error
 *
 * Outbound helpers exposed:
 *   askQuestion(id, text)  – submit a selected question on your turn
 *   sendAnswer(bool)       – respond Yes/No to an incoming question
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { LogEntry } from '../components/gameRoom/gameRoom.types';

const WS_BASE = import.meta.env.VITE_WS_BASE_URL ?? 'ws://localhost:8000';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'waiting_for_opponent'
  | 'game_started'
  | 'disconnected'
  | 'error';

export interface PendingQuestion {
  questionId: string;
  questionText: string;
  askerId: string;
}

export interface GameSocketState {
  status: ConnectionStatus;
  isYourTurn: boolean;
  /** A question from the opponent that YOU need to answer */
  pendingQuestion: PendingQuestion | null;
  /** Whether your question is awaiting the opponent's answer */
  waitingForAnswer: boolean;
  logs: LogEntry[];
  opponentId: string | null;
  playerCount: number;
  errorMessage: string | null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGameSocket(roomCode: string, playerId: string) {
  const wsRef = useRef<WebSocket | null>(null);

  const [state, setState] = useState<GameSocketState>({
    status: 'connecting',
    isYourTurn: false,
    pendingQuestion: null,
    waitingForAnswer: false,
    logs: [],
    opponentId: null,
    playerCount: 0,
    errorMessage: null,
  });

  // -------------------------------------------------------------------------
  // Connect
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!roomCode || !playerId) return;

    const url = `${WS_BASE}/ws/${encodeURIComponent(roomCode)}/${encodeURIComponent(playerId)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setState((prev) => ({ ...prev, status: 'connecting' }));
    };

    ws.onmessage = (event: MessageEvent) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(event.data as string) as Record<string, unknown>;
      } catch {
        return;
      }

      const type = msg.type as string;

      switch (type) {
        case 'joined': {
          const isYourTurn = msg.is_your_turn as boolean;
          const playerCount = msg.player_count as number;
          setState((prev) => ({
            ...prev,
            status: playerCount < 2 ? 'waiting_for_opponent' : 'game_started',
            isYourTurn,
            playerCount,
          }));
          break;
        }

        case 'opponent_joined': {
          const opponentId = msg.opponent_id as string;
          const playerCount = msg.player_count as number;
          setState((prev) => ({
            ...prev,
            opponentId,
            playerCount,
            status: playerCount >= 2 ? prev.status : 'waiting_for_opponent',
          }));
          break;
        }

        case 'game_start': {
          const currentTurn = msg.current_turn as string;
          setState((prev) => ({
            ...prev,
            status: 'game_started',
            isYourTurn: currentTurn === playerId,
          }));
          break;
        }

        case 'question_received': {
          // Opponent asked us a question — we need to answer
          setState((prev) => ({
            ...prev,
            pendingQuestion: {
              questionId: msg.question_id as string,
              questionText: msg.question_text as string,
              askerId: msg.asker_id as string,
            },
          }));
          break;
        }

        case 'question_sent': {
          // Our question was received by the server; waiting for opponent's answer
          setState((prev) => ({
            ...prev,
            waitingForAnswer: true,
          }));
          break;
        }

        case 'answer_received': {
          const answer = msg.answer as boolean;
          const nextTurn = msg.next_turn as string;
          const questionText = msg.question_text as string;
          const askerId = msg.asker_id as string;
          const timestamp = (msg.timestamp as string) ?? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const newEntry: LogEntry = {
            id: Date.now().toString(),
            sender: askerId === playerId ? 'You' : 'Opponent',
            text: questionText,
            answer: answer ? 'Yes' : 'No',
            timestamp,
          };

          setState((prev) => ({
            ...prev,
            isYourTurn: nextTurn === playerId,
            pendingQuestion: null,
            waitingForAnswer: false,
            logs: [...prev.logs, newEntry],
          }));
          break;
        }

        case 'opponent_disconnected': {
          setState((prev) => ({
            ...prev,
            status: 'waiting_for_opponent',
            opponentId: null,
            playerCount: 1,
          }));
          break;
        }

        case 'error': {
          setState((prev) => ({
            ...prev,
            errorMessage: msg.message as string,
          }));
          break;
        }

        default:
          break;
      }
    };

    ws.onclose = () => {
      setState((prev) => ({ ...prev, status: 'disconnected' }));
    };

    ws.onerror = () => {
      setState((prev) => ({ ...prev, status: 'error', errorMessage: 'WebSocket connection failed' }));
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [roomCode, playerId]);

  // -------------------------------------------------------------------------
  // Outbound actions
  // -------------------------------------------------------------------------

  const askQuestion = useCallback(
    (questionId: string, questionText: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: 'ask_question', question_id: questionId, question_text: questionText })
        );
      }
    },
    []
  );

  const sendAnswer = useCallback((answer: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'answer', answer }));
    }
  }, []);

  return { state, askQuestion, sendAnswer };
}
