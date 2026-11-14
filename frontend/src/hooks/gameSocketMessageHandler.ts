import type { LogEntry } from '../components/gameRoom/gameRoom.types';
import type { BoardState } from '../types';
import type { GameSocketState } from './gameSocketTypes';
import { formatTimestamp, isBoardState } from './gameSocketUtils';

/**
 * Pure reducer function to compute the next GameSocketState based on an incoming WebSocket message.
 */
export function processSocketMessage(
  msg: Record<string, unknown>,
  playerId: string,
  prev: GameSocketState,
): GameSocketState {
  const type = msg.type;

  switch (type) {
    case 'joined': {
      const isYourTurn = msg.is_your_turn === true;
      const playerCount =
        typeof msg.player_count === 'number' ? msg.player_count : 0;

      return {
        ...prev,
        status: playerCount < 2 ? 'waiting_for_opponent' : 'game_started',
        isYourTurn,
        playerCount,
        errorMessage: null,
      };
    }

    case 'opponent_joined': {
      const opponentId =
        typeof msg.opponent_id === 'string' ? msg.opponent_id : null;
      const playerCount =
        typeof msg.player_count === 'number' ? msg.player_count : 0;

      return {
        ...prev,
        opponentId,
        playerCount,
        status: playerCount >= 2 ? prev.status : 'waiting_for_opponent',
      };
    }

    case 'game_start': {
      const currentTurn =
        typeof msg.current_turn === 'string' ? msg.current_turn : '';

      return {
        ...prev,
        status: 'game_started',
        isYourTurn: currentTurn === playerId,
        playerCount: Math.max(prev.playerCount, 2),
      };
    }

    case 'question_received': {
      if (
        typeof msg.question_id !== 'string' ||
        typeof msg.question_text !== 'string' ||
        typeof msg.asker_id !== 'string'
      ) {
        return prev;
      }

      return {
        ...prev,
        pendingQuestion: {
          questionId: msg.question_id,
          questionText: msg.question_text,
          askerId: msg.asker_id,
        },
      };
    }

    case 'question_sent': {
      return {
        ...prev,
        waitingForAnswer: true,
      };
    }

    case 'answer_received': {
      const answer = msg.answer === true;
      const questionText =
        typeof msg.question_text === 'string' ? msg.question_text : '';
      const askerId =
        typeof msg.asker_id === 'string' ? msg.asker_id : '';
      const eliminatingPlayer =
        typeof msg.eliminating_player === 'string'
          ? msg.eliminating_player
          : askerId;

      const isMeEliminating = eliminatingPlayer === playerId;
      const isOppEliminating = Boolean(
        eliminatingPlayer && eliminatingPlayer !== playerId,
      );

      const timestamp = formatTimestamp(msg.timestamp);

      const newEntry: LogEntry = {
        id: Date.now().toString(),
        sender: askerId === playerId ? 'You' : 'Opponent',
        text: questionText,
        answer: answer ? 'Yes' : 'No',
        timestamp,
      };

      return {
        ...prev,
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
      };
    }

    case 'elimination_done': {
      const nextTurn =
        typeof msg.next_turn === 'string' ? msg.next_turn : '';

      return {
        ...prev,
        isEliminating: false,
        isOpponentEliminating: false,
        isYourTurn: nextTurn === playerId,
      };
    }

    case 'opponent_disconnected': {
      return {
        ...prev,
        status: 'waiting_for_opponent',
        opponentId: null,
        playerCount: 1,
        opponentBoard: {},
      };
    }

    case 'opponent_board_updated': {
      if (!isBoardState(msg.board_state)) {
        return prev;
      }

      return {
        ...prev,
        opponentBoard: msg.board_state as BoardState,
        opponentId:
          typeof msg.player_id === 'string' ? msg.player_id : prev.opponentId,
      };
    }

    case 'my_board_restored': {
      if (!isBoardState(msg.board_state)) {
        return prev;
      }

      return {
        ...prev,
        myBoard: msg.board_state as BoardState,
      };
    }

    case 'guess_result': {
      const guesserId =
        typeof msg.guesser_id === 'string' ? msg.guesser_id : '';
      const characterId =
        typeof msg.character_id === 'string' ? msg.character_id : '';
      const correct = msg.correct === true;
      const timestamp = formatTimestamp(msg.timestamp);

      return {
        ...prev,
        guessResult: { guesserId, characterId, correct, timestamp },
      };
    }

    case 'game_over': {
      const winnerId =
        typeof msg.winner_id === 'string' ? msg.winner_id : '';
      const timestamp = formatTimestamp(msg.timestamp);

      return {
        ...prev,
        isYourTurn: false,
        isEliminating: false,
        isOpponentEliminating: false,
        gameOver: { winnerId, timestamp },
      };
    }

    case 'error': {
      return {
        ...prev,
        errorMessage:
          typeof msg.message === 'string'
            ? msg.message
            : 'An unknown server error occurred',
      };
    }

    default:
      return prev;
  }
}

