import React, { useEffect, useState, useCallback } from 'react';
import { getAllCharacters } from '../services/characterService';
import { getAllQuestions } from '../services/questionService';
import type { Question } from './gameRoom/InterrogationPanel';
import type { BoardState, Character } from '../types';
import { CharacterGrid } from './CharacterGrid';
import { GameHeader } from './gameRoom/GameHeader';
import { MatchIntelPanel } from './gameRoom/MatchIntelPanel';
import { InterrogationPanel } from './gameRoom/InterrogationPanel';
import { AnswerPrompt } from './gameRoom/AnswerPrompt';
import { useGameSocket } from '../hooks/useGameSocket';

interface GameRoomProps {
  onLeaveRoom?: () => void;
  roomId?: string;
  userCharacter?: Character | null;
  /** Stable player identifier (e.g. generated on room join/create) */
  playerId?: string;
}

export const GameRoom: React.FC<GameRoomProps> = ({
  onLeaveRoom,
  roomId = 'ROOM-0000',
  userCharacter,
  playerId = 'player-' + Math.random().toString(36).slice(2, 7),
}) => {
  // ------------------------------------------------------------------
  // Character board
  // ------------------------------------------------------------------
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [charactersError, setCharactersError] = useState<string | null>(null);
  const [activeBoardView, setActiveBoardView] = useState<'mine' | 'opponent'>(
    'mine',
  );

  useEffect(() => {
    let cancelled = false;

    getAllCharacters()
      .then((data) => {
        if (!cancelled) setCharacters(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setCharactersError(
            err instanceof Error ? err.message : 'Failed to load characters',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingCharacters(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ------------------------------------------------------------------
  // Question list (fetched from REST — static reference data)
  // ------------------------------------------------------------------
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAllQuestions()
      .then((data) => {
        if (!cancelled) setQuestions(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setQuestionsError(
            err instanceof Error ? err.message : 'Failed to load questions',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingQuestions(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ------------------------------------------------------------------
  // WebSocket
  // ------------------------------------------------------------------
  const {
    state: socketState,
    askQuestion,
    sendAnswer,
    sendBoardUpdate,
    sendEliminationDone,
  } = useGameSocket(roomId, playerId);

  // ------------------------------------------------------------------
  // Board state
  // ------------------------------------------------------------------
  const [boardState, setBoardState] = useState<BoardState>({});
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // Automatically shift to opponent's board while opponent is eliminating characters
  useEffect(() => {
    if (socketState.isOpponentEliminating) {
      setActiveBoardView('opponent');
    }
  }, [socketState.isOpponentEliminating]);

  // When opponent finishes elimination, shift back to your board if it's your turn
  useEffect(() => {
    if (!socketState.isOpponentEliminating && socketState.isYourTurn) {
      setActiveBoardView('mine');
    }
  }, [socketState.isOpponentEliminating, socketState.isYourTurn]);

  // If you are eliminating characters, make sure you are on 'mine' board
  useEffect(() => {
    if (socketState.isEliminating) {
      setActiveBoardView('mine');
    }
  }, [socketState.isEliminating]);

  // Restore and synchronize this player's board from the socket state.
  useEffect(() => {
    setBoardState(socketState.myBoard);
  }, [socketState.myBoard]);

  const handleCharacterClick = useCallback(
    (characterId: string) => {
      // The opponent's board is read-only.
      if (activeBoardView !== 'mine') return;

      setBoardState((prev) => {
        const currentState = prev[characterId] || 'available';

        const nextState =
          currentState === 'available'
            ? 'selected'
            : currentState === 'selected'
              ? 'eliminated'
              : 'available';

        const updatedBoardState: BoardState = {
          ...prev,
          [characterId]: nextState,
        };

        // Synchronize the updated board with the server.
        sendBoardUpdate(updatedBoardState);

        return updatedBoardState;
      });
    },
    [activeBoardView, sendBoardUpdate],
  );

  // ------------------------------------------------------------------
  // Socket state
  // ------------------------------------------------------------------
  const {
    status,
    isYourTurn,
    pendingQuestion,
    waitingForAnswer,
    logs,
  } = socketState;

  // Secret character reference
  const secretCharacter = userCharacter ?? characters[0] ?? null;

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------
  const handleAskQuestion = useCallback(
    (questionText: string) => {
      const question = questions.find((q) => q.text === questionText);

      if (!question) return;

      askQuestion(question.id, questionText);
      setSelectedQuestion(null);
      setActiveBoardView('mine');
    },
    [questions, askQuestion],
  );

  const handleAnswer = useCallback(
    (answer: boolean) => {
      sendAnswer(answer);
    },
    [sendAnswer],
  );

  // ------------------------------------------------------------------
  // Connection status banner
  // ------------------------------------------------------------------
  const statusBanner: React.ReactNode = (() => {
    if (status === 'connecting') {
      return (
        <div className="shrink-0 text-center text-xs font-mono text-[#93DD35] py-1.5 border-b border-[#2E3830] animate-pulse bg-[#171C18]/60">
          CONNECTING TO ROOM...
        </div>
      );
    }

    if (status === 'waiting_for_opponent') {
      return (
        <div className="shrink-0 text-center text-xs font-mono text-amber-400 py-1.5 border-b border-amber-500/20 bg-amber-500/5">
          WAITING FOR OPPONENT TO JOIN...
        </div>
      );
    }

    if (status === 'error' || status === 'disconnected') {
      return (
        <div className="shrink-0 text-center text-xs font-mono text-red-400 py-1.5 border-b border-red-500/20 bg-red-500/5">
          {status === 'error'
            ? `CONNECTION ERROR${
                socketState.errorMessage
                  ? ': ' + socketState.errorMessage
                  : ''
              }`
            : 'DISCONNECTED — RECONNECTING...'}
        </div>
      );
    }

    return null;
  })();

  // The board currently being displayed.
  const displayedBoardState =
    activeBoardView === 'mine' ? boardState : socketState.opponentBoard;

  return (
    <div
      className="relative h-screen w-full bg-[#111612] text-[#FFFFFF] font-sans flex flex-col overflow-hidden bg-center"
      style={{
        backgroundImage: `
          linear-gradient(rgba(4, 5, 4, 0.8), rgba(5, 8, 6, 0.92)),
          url('https://i.pinimg.com/736x/f5/e5/47/f5e5475127ab0cd4f9681e67fad5b623.jpg')
        `,
      }}
    >
      {/* Ambient Lighting Layers */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-[#93DD35]/10 blur-[140px] rounded-full z-0" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#202621]/40 blur-[140px] rounded-full z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] bg-[#93DD35]/5 blur-[140px] rounded-full z-0" />

      <GameHeader roomId={roomId} onLeaveRoom={onLeaveRoom} />

      {/* Connection status banner */}
      {statusBanner}

      {/* Answer prompt overlay — shown when opponent asked YOU a question */}
      {pendingQuestion && (
        <AnswerPrompt
          questionText={pendingQuestion.questionText}
          onAnswer={handleAnswer}
          secretCharacter={secretCharacter}
        />
      )}

      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1800px] mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4 overflow-hidden">
        {secretCharacter && (
          <MatchIntelPanel
            isYourTurn={isYourTurn}
            logs={logs}
            secretCharacter={secretCharacter}
            waitingForAnswer={waitingForAnswer}
            opponentConnected={socketState.playerCount >= 2}
          />
        )}

        <section className="lg:col-span-6 flex flex-col h-full min-h-0 border border-[#2E3830] rounded-xl backdrop-blur-sm shadow-xl overflow-hidden">
          {/* Tactical Board Header */}
          <div className="shrink-0 px-3.5 py-2.5 border-b border-[#2E3830] bg-[#171C18]/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-1.5 h-3.5 bg-[#93DD35] rounded-full shadow-[0_0_8px_rgba(147,221,53,0.5)]" />
              <h2 className="text-[11px] font-bold text-[#FFFFFF] uppercase tracking-widest font-mono">
                {activeBoardView === 'mine'
                  ? 'My Tactical Board'
                  : "Opponent's Board"}
              </h2>
            </div>

            <div className="flex items-center gap-2.5 font-mono text-[10px] shrink-0">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2CDC3]/50" />
                <span className="text-[#C2CDC3]">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#93DD35]" />
                <span className="text-[#C2CDC3]">Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-[#C2CDC3]">Eliminated</span>
              </div>
            </div>
          </div>

          {/* Board View Switcher */}
          <div className="shrink-0 px-3 py-2 flex gap-2 border-b border-[#2E3830] bg-[#171C18]/30">
            <button
              type="button"
              onClick={() => setActiveBoardView('mine')}
              aria-pressed={activeBoardView === 'mine'}
              className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wide transition-colors ${
                activeBoardView === 'mine'
                  ? 'bg-[#93DD35] text-[#111612] font-bold'
                  : 'bg-[#202621] text-[#C2CDC3] hover:bg-[#2E3830]'
              }`}
            >
              My Board
            </button>

            <button
              type="button"
              onClick={() => setActiveBoardView('opponent')}
              aria-pressed={activeBoardView === 'opponent'}
              disabled={socketState.playerCount < 2}
              className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                activeBoardView === 'opponent'
                  ? 'bg-[#93DD35] text-[#111612] font-bold'
                  : 'bg-[#202621] text-[#C2CDC3] hover:bg-[#2E3830]'
              }`}
            >
              Opponent's Board
            </button>
          </div>

          {/* Elimination Phase Action Banner for active player */}
          {socketState.isEliminating && (
            <div className="shrink-0 px-3.5 py-2.5 bg-gradient-to-r from-[#93DD35]/20 via-[#171C18] to-[#93DD35]/10 border-b border-[#93DD35]/40 flex items-center justify-between gap-3 shadow-md animate-fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#93DD35] animate-ping shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#93DD35] uppercase font-mono tracking-wide truncate">
                    Elimination Phase Active
                  </p>
                  <p className="text-[10px] text-[#C2CDC3] truncate">
                    Click characters below to eliminate them, then notify opponent
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="done-eliminating-btn"
                onClick={sendEliminationDone}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-[#93DD35] hover:bg-[#85c82e] active:scale-[0.97] text-[#111612] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Done Eliminating
              </button>
            </div>
          )}

          {/* Opponent Eliminating Notice Banner */}
          {socketState.isOpponentEliminating && (
            <div className="shrink-0 px-3.5 py-2 bg-amber-500/10 border-b border-amber-500/25 flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <p className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wide truncate">
                  Opponent is eliminating characters · Viewing live updates
                </p>
              </div>
              <span className="text-[10px] font-mono text-amber-200/70 uppercase shrink-0 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                Live View
              </span>
            </div>
          )}

          {/* Character Grid */}
          <div className="p-3 sm:p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {loadingCharacters ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-t-[#93DD35] border-b-[#2E3830] border-r-[#2E3830] rounded-full animate-spin" />
                <span className="ml-2 text-[#93DD35] text-xs font-semibold uppercase tracking-wider">
                  Loading board...
                </span>
              </div>
            ) : charactersError ? (
              <p role="alert" className="text-sm text-red-400">
                {charactersError}
              </p>
            ) : characters.length === 0 ? (
              <p className="text-sm text-[#C2CDC3]">
                No characters available.
              </p>
            ) : (
              <>
                {activeBoardView === 'opponent' && (
                  <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-[#C2CDC3]">
                    Read-only view · Opponent's eliminations update live
                  </p>
                )}

                <CharacterGrid
                  characters={characters}
                  boardState={displayedBoardState}
                  onCharacterClick={handleCharacterClick}
                />
              </>
            )}
          </div>
        </section>

        <InterrogationPanel
          isYourTurn={
            isYourTurn &&
            !waitingForAnswer &&
            !pendingQuestion &&
            !socketState.isEliminating &&
            !socketState.isOpponentEliminating &&
            status === 'game_started'
          }
          questions={questions}
          loadingQuestions={loadingQuestions}
          questionsError={questionsError}
          selectedQuestion={selectedQuestion}
          onSelectQuestion={setSelectedQuestion}
          onAskQuestion={handleAskQuestion}
          waitingForAnswer={waitingForAnswer}
          isOpponentEliminating={socketState.isOpponentEliminating}
          isEliminating={socketState.isEliminating}
          onDoneEliminating={sendEliminationDone}
        />
      </main>
    </div>
  );
};

export default GameRoom;