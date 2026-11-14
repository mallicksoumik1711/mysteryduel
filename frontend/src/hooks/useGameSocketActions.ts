import { useCallback } from 'react';
import type React from 'react';
import type { BoardState } from '../types';
import type { GameSocketActions, GameSocketState } from './gameSocketTypes';

export function useGameSocketActions(
  wsRef: React.RefObject<WebSocket | null>,
  setState: React.Dispatch<React.SetStateAction<GameSocketState>>,
): GameSocketActions {
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
    [wsRef],
  );

  const sendAnswer = useCallback(
    (answer: boolean) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return;
      }

      wsRef.current.send(
        JSON.stringify({
          type: 'answer',
          answer,
        }),
      );
    },
    [wsRef],
  );

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
    [wsRef, setState],
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
  }, [wsRef, setState]);

  const sendSetCharacter = useCallback(
    (characterId: string) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return;
      }

      wsRef.current.send(
        JSON.stringify({
          type: 'set_character',
          character_id: characterId,
        }),
      );
    },
    [wsRef],
  );

  const sendGuess = useCallback(
    (characterId: string) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        return;
      }

      wsRef.current.send(
        JSON.stringify({
          type: 'guess_character',
          character_id: characterId,
        }),
      );
    },
    [wsRef],
  );

  return {
    askQuestion,
    sendAnswer,
    sendBoardUpdate,
    sendEliminationDone,
    sendSetCharacter,
    sendGuess,
  };
}

