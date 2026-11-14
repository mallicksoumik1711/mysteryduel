import type { BoardState } from '../types';
import type { GameSocketState } from './gameSocketTypes';

const VALID_CHARACTER_STATES = new Set([
  'available',
  'selected',
  'eliminated',
]);

export function isBoardState(value: unknown): value is BoardState {
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

export function formatTimestamp(rawTimestamp?: unknown): string {
  if (typeof rawTimestamp === 'string' && rawTimestamp.trim().length > 0) {
    return rawTimestamp;
  }
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getWebSocketBaseUrl(): string {
  return import.meta.env.VITE_WS_BASE_URL ?? 'ws://localhost:8000';
}

export const INITIAL_GAME_SOCKET_STATE: GameSocketState = {
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
  guessResult: null,
  gameOver: null,
};

