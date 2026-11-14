import type { LogEntry } from '../components/gameRoom/gameRoom.types';
import type { BoardState } from '../types';

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

export interface GuessResult {
  guesserId: string;
  characterId: string;
  correct: boolean;
  timestamp: string;
}

export interface GameOverState {
  winnerId: string;
  timestamp: string;
}

export interface LastAnswer {
  questionText: string;
  answer: boolean;
  askerId: string;
}

export interface GameSocketState {
  status: ConnectionStatus;
  isYourTurn: boolean;
  isEliminating: boolean;
  isOpponentEliminating: boolean;
  lastAnswer: LastAnswer | null;
  pendingQuestion: PendingQuestion | null;
  waitingForAnswer: boolean;
  logs: LogEntry[];
  opponentId: string | null;
  playerCount: number;
  errorMessage: string | null;
  myBoard: BoardState;
  opponentBoard: BoardState;
  /** Set when a guess has been evaluated (cleared on new game) */
  guessResult: GuessResult | null;
  /** Set when the game is over */
  gameOver: GameOverState | null;
}

export interface GameSocketActions {
  askQuestion: (questionId: string, questionText: string) => void;
  sendAnswer: (answer: boolean) => void;
  sendBoardUpdate: (boardState: BoardState) => void;
  sendEliminationDone: () => void;
  sendSetCharacter: (characterId: string) => void;
  sendGuess: (characterId: string) => void;
}

