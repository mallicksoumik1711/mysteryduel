/**
 * useGameSocket
 * =============
 * Manages the WebSocket connection for a MysteryDuel game room.
 *
 * Connection URL: ws://localhost:8000/ws/{roomCode}/{playerId}
 *
 * Inbound message types:
 *   joined
 *   opponent_joined
 *   game_start
 *   question_received
 *   question_sent
 *   answer_received
 *   opponent_disconnected
 *   opponent_board_updated
 *   my_board_restored
 *   error
 *
 * Outbound helpers:
 *   askQuestion(id, text)
 *   sendAnswer(bool)
 *   sendBoardUpdate(boardState)
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { LogEntry } from '../components/gameRoom/gameRoom.types';
import type { BoardState } from '../types';

const WS_BASE =
  import.meta.env.VITE_WS_BASE_URL ?? 'ws://localhost:8000';

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
  isEliminating: boolean;
  isOpponentEliminating: boolean;
  lastAnswer: { questionText: string; answer: boolean; askerId: string } | null;
  pendingQuestion: PendingQuestion | null;
  waitingForAnswer: boolean;
  logs: LogEntry[];
  opponentId: string | null;
  playerCount: number;
  errorMessage: string | null;
  myBoard: BoardState;
  opponentBoard: BoardState;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_CHARACTER_STATES = new Set([
  'available',
  'selected',
  'eliminated',
]);

function isBoardState(value: unknown): value is BoardState {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  return Object.values(value).every(
    (state) =>
      typeof state === 'string' &&
      VALID_CHARACTER_STATES.has(state),
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGameSocket(roomCode: string, playerId: string) {
  const wsRef = useRef<WebSocket | null>(null);

  const [state, setState] = useState<GameSocketState>({
    status: 'connecting',
    isYourTurn: false,
    isEliminating: false,
    isOpponentEliminating: false,
    lastAnswer: null,
    pendingQuestion: null,
    waitingForAnswer: false,
    logs: [],
    opponentId: null,
    playerCount: 0,
    errorMessage: null,
    myBoard: {},
    opponentBoard: {},
  });

  // -------------------------------------------------------------------------
  // Connect
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const url =
      `${WS_BASE}/ws/${encodeURIComponent(roomCode)}/${encodeURIComponent(playerId)}`;

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
      let msg: Record<string, unknown>;

      try {
        const parsed: unknown = JSON.parse(event.data as string);

        if (
          typeof parsed !== 'object' ||
          parsed === null ||
          Array.isArray(parsed)
        ) {
          return;
        }

        msg = parsed as Record<string, unknown>;
      } catch {
        return;
      }

      const type = msg.type;

      switch (type) {
        case 'joined': {
          const isYourTurn = msg.is_your_turn === true;
          const playerCount =
            typeof msg.player_count === 'number'
              ? msg.player_count
              : 0;

          setState((prev) => ({
            ...prev,
            status:
              playerCount < 2
                ? 'waiting_for_opponent'
                : 'game_started',
            isYourTurn,
            playerCount,
            errorMessage: null,
          }));
          break;
        }

        case 'opponent_joined': {
          const opponentId =
            typeof msg.opponent_id === 'string'
              ? msg.opponent_id
              : null;

          const playerCount =
            typeof msg.player_count === 'number'
              ? msg.player_count
              : 0;

          setState((prev) => ({
            ...prev,
            opponentId,
            playerCount,
            status:
              playerCount >= 2
                ? prev.status
                : 'waiting_for_opponent',
          }));
          break;
        }

        case 'game_start': {
          const currentTurn =
            typeof msg.current_turn === 'string'
              ? msg.current_turn
              : '';

          setState((prev) => ({
            ...prev,
            status: 'game_started',
            isYourTurn: currentTurn === playerId,
            playerCount: Math.max(prev.playerCount, 2),
          }));
          break;
        }

        case 'question_received': {
          if (
            typeof msg.question_id !== 'string' ||
            typeof msg.question_text !== 'string' ||
            typeof msg.asker_id !== 'string'
          ) {
            break;
          }

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
          setState((prev) => ({
            ...prev,
            waitingForAnswer: true,
          }));
          break;
        }

        case 'answer_received': {
          const answer = msg.answer === true;
          const questionText =
            typeof msg.question_text === 'string'
              ? msg.question_text
              : '';
          const askerId =
            typeof msg.asker_id === 'string'
              ? msg.asker_id
              : '';
          const eliminatingPlayer =
            typeof msg.eliminating_player === 'string'
              ? msg.eliminating_player
              : askerId;

          const isMeEliminating = eliminatingPlayer === playerId;
          const isOppEliminating = Boolean(
            eliminatingPlayer && eliminatingPlayer !== playerId,
          );

          const timestamp =
            typeof msg.timestamp === 'string'
              ? msg.timestamp
              : new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

          const newEntry: LogEntry = {
            id: Date.now().toString(),
            sender: askerId === playerId ? 'You' : 'Opponent',
            text: questionText,
            answer: answer ? 'Yes' : 'No',
            timestamp,
          };

          setState((prev) => ({
            ...prev,
            // When an answer is given, elimination phase begins - questions are blocked until elimination is done
            isYourTurn: false,
            isEliminating: isMeEliminating,
            isOpponentEliminating: isOppEliminating,
            lastAnswer: {
              questionText,
              answer,
              askerId,
            },
            pendingQuestion: null,
            waitingForAnswer: false,
            logs: [...prev.logs, newEntry],
          }));
          break;
        }

        case 'elimination_done': {
          const nextTurn =
            typeof msg.next_turn === 'string'
              ? msg.next_turn
              : '';

          setState((prev) => ({
            ...prev,
            isEliminating: false,
            isOpponentEliminating: false,
            isYourTurn: nextTurn === playerId,
          }));
          break;
        }

        case 'opponent_disconnected': {
          setState((prev) => ({
            ...prev,
            status: 'waiting_for_opponent',
            opponentId: null,
            playerCount: 1,
            opponentBoard: {},
          }));
          break;
        }

        case 'opponent_board_updated': {
          if (!isBoardState(msg.board_state)) {
            break;
          }

          setState((prev) => ({
            ...prev,
            opponentBoard: msg.board_state as BoardState,
            opponentId:
              typeof msg.player_id === 'string'
                ? msg.player_id
                : prev.opponentId,
          }));
          break;
        }

        case 'my_board_restored': {
          if (!isBoardState(msg.board_state)) {
            break;
          }

          setState((prev) => ({
            ...prev,
            myBoard: msg.board_state as BoardState,
          }));
          break;
        }

        case 'error': {
          setState((prev) => ({
            ...prev,
            errorMessage:
              typeof msg.message === 'string'
                ? msg.message
                : 'An unknown server error occurred',
          }));
          break;
        }

        default:
          break;
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

  // -------------------------------------------------------------------------
  // Outbound actions
  // -------------------------------------------------------------------------

  const askQuestion = useCallback(
    (questionId: string, questionText: string) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return;
      }

      wsRef.current.send(
        JSON.stringify({
          type: 'ask_question',
          question_id: questionId,
          question_text: questionText,
        }),
      );
    },
    [],
  );

  const sendAnswer = useCallback((answer: boolean) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      return;
    }

    wsRef.current.send(
      JSON.stringify({
        type: 'answer',
        answer,
      }),
    );
  }, []);

  const sendBoardUpdate = useCallback(
    (boardState: BoardState) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return;
      }

      wsRef.current.send(
        JSON.stringify({
          type: 'board_update',
          board_state: boardState,
        }),
      );

      setState((prev) => ({
        ...prev,
        myBoard: boardState,
      }));
    },
    [],
  );

  const sendEliminationDone = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) {
      return;
    }

    wsRef.current.send(
      JSON.stringify({
        type: 'elimination_done',
      }),
    );

    setState((prev) => ({
      ...prev,
      isEliminating: false,
    }));
  }, []);

  return {
    state,
    askQuestion,
    sendAnswer,
    sendBoardUpdate,
    sendEliminationDone,
  };
}