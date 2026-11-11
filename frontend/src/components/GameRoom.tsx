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
import { GuessConfirmModal } from './gameRoom/GuessConfirmModal';
import { GameOverOverlay } from './gameRoom/GameOverOverlay';
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
    sendSetCharacter,
    sendGuess,
  } = useGameSocket(roomId, playerId);

  // ------------------------------------------------------------------
  // Board state
  // ------------------------------------------------------------------
  const [boardState, setBoardState] = useState<BoardState>({});
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [guessCharacterId, setGuessCharacterId] = useState<string | null>(null);
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState<'intel' | 'interrogation' | null>(null);

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

  // Auto-close mobile drawer when answer prompt, guess modal, or game over appears
  useEffect(() => {
    if (socketState.pendingQuestion || showGuessModal || socketState.gameOver) {
      setMobileDrawer(null);
    }
  }, [socketState.pendingQuestion, showGuessModal, socketState.gameOver]);

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawer(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Register the player's secret character with the server once the socket is
  // established and the secret character is known.
  const secretCharacterForEffect = userCharacter ?? characters[0] ?? null;
  useEffect(() => {
    if (
      (socketState.status === 'game_started' || socketState.status === 'waiting_for_opponent' || socketState.status === 'connected') &&
      secretCharacterForEffect
    ) {
      sendSetCharacter(secretCharacterForEffect.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketState.status, secretCharacterForEffect?.id]);

  const handleCharacterClick = useCallback(
    (characterId: string) => {
      // The opponent's board is read-only.
      if (activeBoardView !== 'mine') return;

      setBoardState((prev) => {
        const currentState = prev[characterId] || 'available';

        let updatedBoardState: BoardState;

        if (currentState === 'available') {
          // available → selected.
          // Enforce single-selection: push any existing "selected" character back to "available".
          const withPrevDeselected = Object.fromEntries(
            Object.entries(prev).map(([id, state]) =>
              state === 'selected' ? [id, 'available'] : [id, state],
            ),
          ) as BoardState;
          updatedBoardState = { ...withPrevDeselected, [characterId]: 'selected' };
          setGuessCharacterId(characterId);
        } else if (currentState === 'selected') {
          // selected → eliminated (second click).
          updatedBoardState = { ...prev, [characterId]: 'eliminated' };
          setGuessCharacterId(null);
        } else {
          // eliminated → available (third click).
          updatedBoardState = { ...prev, [characterId]: 'available' };
        }

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

    if (status === 'error' || status === 'disconnected') {
      return (
        <div className="shrink-0 text-center text-xs font-mono text-red-400 py-1.5 border-b border-red-500/20 bg-red-500/5">
          {status === 'error'
            ? `CONNECTION ERROR${socketState.errorMessage
              ? ': ' + socketState.errorMessage
              : ''
            }`
            : 'DISCONNECTED — RECONNECTING...'}
        </div>
      );
    }

    if (status === 'waiting_for_opponent' || socketState.playerCount < 2) {
      return (
        <div className="shrink-0 text-center text-xs font-mono text-amber-400 py-1.5 border-b border-amber-500/20 bg-amber-500/5 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>WAITING FOR OPPONENT TO JOIN...</span>
        </div>
      );
    }

    return null;
  })();

  // The board currently being displayed.
  const displayedBoardState =
    activeBoardView === 'mine' ? boardState : socketState.opponentBoard;

  // Resolve the full character object for the guess modal.
  const guessCharacter = guessCharacterId
    ? characters.find((c) => c.id === guessCharacterId) ?? null
    : null;

  // ------------------------------------------------------------------
  // Guess result / game over
  // ------------------------------------------------------------------
  const { guessResult, gameOver } = socketState;

  // The character that was guessed (used in the overlay).
  const guessedCharacter = guessResult
    ? characters.find((c) => c.id === guessResult.characterId) ?? null
    : null;

  const isLocalPlayerWinner =
    gameOver !== null && gameOver.winnerId === playerId;

  return (
    <div
      className="relative h-[100dvh] min-h-[100svh] w-full bg-[#111612] text-[#FFFFFF] font-sans flex flex-col overflow-hidden bg-center"
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

      {/* Header responsiveness on top */}
      <GameHeader roomId={roomId} onLeaveRoom={onLeaveRoom} />

      {/* Connection status banner (e.g. waiting for opponent) below header */}
      {statusBanner}

      {/* Mobile-only active game / turn banner (visible below header on small devices when game is in progress) */}
      {status === 'game_started' && socketState.playerCount >= 2 && (
        <div className="lg:hidden shrink-0 px-3 py-1.5 border-b border-[#2E3830] bg-[#171C18]/80 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isYourTurn ? 'bg-[#93DD35] animate-pulse shadow-[0_0_8px_rgba(147,221,53,0.8)]' : 'bg-[#C2CDC3]/40'
              }`}
            />
            <span className={`truncate ${isYourTurn ? 'text-[#93DD35] font-bold tracking-wider' : 'text-[#C2CDC3]'}`}>
              {waitingForAnswer
                ? 'WAITING FOR OPPONENT TO ANSWER...'
                : socketState.isEliminating
                  ? 'ELIMINATION PHASE ACTIVE'
                  : socketState.isOpponentEliminating
                    ? 'OPPONENT ELIMINATING CHARACTERS'
                    : isYourTurn
                      ? 'YOUR TURN'
                      : "OPPONENT'S TURN"}
            </span>
          </div>
          <span className="text-[10px] text-[#C2CDC3]/60 uppercase tracking-wider shrink-0 ml-2">
            {isYourTurn ? 'Select or Guess' : 'Waiting...'}
          </span>
        </div>
      )}

      {/* Answer prompt overlay — shown when opponent asked YOU a question */}
      {pendingQuestion && (
        <AnswerPrompt
          questionText={pendingQuestion.questionText}
          onAnswer={handleAnswer}
          secretCharacter={secretCharacter}
        />
      )}

      {/* Main container: On lg screens, 3-column layout. On small screens, Tactical Board fills the view */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1800px] mx-auto p-2 sm:p-3 lg:p-4 flex flex-col lg:grid lg:grid-cols-12 gap-2 sm:gap-3 lg:gap-4 overflow-hidden">
        {secretCharacter && (
          <MatchIntelPanel
            className="hidden lg:flex lg:col-span-3"
            isYourTurn={isYourTurn}
            logs={logs}
            secretCharacter={secretCharacter}
            waitingForAnswer={waitingForAnswer}
            opponentConnected={socketState.playerCount >= 2}
          />
        )}

        <section className="flex-1 min-h-0 lg:flex-none lg:col-span-6 flex flex-col h-full border border-[#2E3830] backdrop-blur-sm shadow-xl overflow-hidden">
          {/* Tactical Board Header */}
          <div className="shrink-0 px-3 py-2 sm:px-3.5 sm:py-2.5 border-b border-[#2E3830] bg-[#171C18]/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-1.5 h-3.5 bg-[#93DD35] rounded-full shadow-[0_0_8px_rgba(147,221,53,0.5)] shrink-0" />
              <h2 className="text-[10px] sm:text-[11px] font-bold text-[#FFFFFF] uppercase tracking-widest font-mono truncate">
                {activeBoardView === 'mine'
                  ? 'My Tactical Board'
                  : "Opponent's Board"}
              </h2>
            </div>

            <div className="flex items-center gap-x-2 sm:gap-x-2.5 font-mono text-[9px] sm:text-[10px] shrink-0">
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
          <div className="shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-2 border-b border-[#2E3830] bg-[#171C18]/30">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveBoardView('mine')}
                aria-pressed={activeBoardView === 'mine'}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono uppercase tracking-wide transition-colors cursor-pointer ${
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
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono uppercase tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                  activeBoardView === 'opponent'
                    ? 'bg-[#93DD35] text-[#111612] font-bold'
                    : 'bg-[#202621] text-[#C2CDC3] hover:bg-[#2E3830]'
                }`}
              >
                Opponent's Board
              </button>
            </div>

            {/* Guess Character — highlighted when an avatar is selected */}
            <button
              type="button"
              id="guess-character-btn"
              disabled={!guessCharacterId || gameOver !== null}
              onClick={() => guessCharacterId && setShowGuessModal(true)}
              className={`px-2 sm:px-3 py-1.5 text-xs font-mono uppercase tracking-wide transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                guessCharacterId && gameOver === null
                  ? 'bg-[#93DD35] text-[#111612] font-black shadow-[0_0_12px_rgba(147,221,53,0.45)] scale-[1.02]'
                  : 'bg-[#202621] text-[#C2CDC3]/50 cursor-not-allowed opacity-50'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Guess Character</span>
            </button>
          </div>

          {/* Info Panel */}
          <div className="shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 border-b border-[#2E3830] bg-[#171C18]/50 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 shrink-0 text-[#93DD35]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[9.5px] sm:text-[10px] font-mono text-[#C2CDC3]/80 leading-snug">
              <span className="text-[#93DD35] font-semibold">Single click</span> a character to select them, then tap{' '}
              <span className="text-[#93DD35] font-semibold">Guess Character</span> for final selection.{' '}
              <span className="text-[#93DD35] font-semibold">Double-click</span> to eliminate them.
            </p>
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
                className="shrink-0 px-3 py-1.5 bg-[#93DD35] hover:bg-[#85c82e] active:scale-[0.97] text-[#111612] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
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
              <span className="text-[10px] font-mono text-amber-200/70 uppercase shrink-0 bg-amber-500/20 px-2 py-0.5 border border-amber-500/30">
                Live View
              </span>
            </div>
          )}

          {/* Character Grid */}
          <div className="p-2 sm:p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
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
                  <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-[#C2CDC3]">
                    Read-only view · Opponent's eliminations update live
                  </p>
                )}

                <CharacterGrid
                  mode="board"
                  characters={characters}
                  boardState={displayedBoardState}
                  onCharacterClick={handleCharacterClick}
                />
              </>
            )}
          </div>
        </section>

        <InterrogationPanel
          className="hidden lg:flex lg:col-span-3"
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

      {/* ── Mobile Bottom Navigation Bar: Left Hamburger (Match Intel) & Right Hamburger (Interrogation) ── */}
      <nav className="lg:hidden shrink-0 z-30 w-full bg-[#111612]/95 border-t border-[#2E3830] backdrop-blur-md px-3 py-2 flex items-center justify-between gap-3 shadow-2xl">
        {/* Left Hamburger Button: Match Intel */}
        <button
          type="button"
          onClick={() => setMobileDrawer('intel')}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#171C18] hover:bg-[#202621] active:scale-[0.98] border border-[#2E3830] text-xs font-mono font-bold uppercase tracking-wider text-[#C2CDC3] transition-all shadow-sm cursor-pointer"
          aria-label="Open Match Intel panel"
          aria-expanded={mobileDrawer === 'intel'}
        >
          {/* Hamburger icon */}
          <div className="flex flex-col justify-center gap-[3px] w-4 h-3.5 shrink-0">
            <span className="w-full h-[2px] bg-[#93DD35] rounded-full" />
            <span className="w-3/4 h-[2px] bg-[#93DD35] rounded-full" />
            <span className="w-full h-[2px] bg-[#93DD35] rounded-full" />
          </div>
          <span className="truncate">Match Intel</span>
          {logs.length > 0 && (
            <span className="text-[9px] bg-[#202621] text-[#93DD35] px-1.5 py-0.5 border border-[#2E3830] font-mono font-bold">
              {logs.length}
            </span>
          )}
        </button>

        {/* Right Hamburger Button: Interrogation Panel */}
        <button
          type="button"
          onClick={() => setMobileDrawer('interrogation')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 border text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] cursor-pointer ${
            isYourTurn && status === 'game_started'
              ? 'bg-[#93DD35]/15 border-[#93DD35] text-[#93DD35] shadow-[0_0_12px_rgba(147,221,53,0.3)] animate-pulse'
              : 'bg-[#171C18] hover:bg-[#202621] border-[#2E3830] text-[#C2CDC3]'
          }`}
          aria-label="Open Interrogation panel"
          aria-expanded={mobileDrawer === 'interrogation'}
        >
          {/* Hamburger icon */}
          <div className="flex flex-col justify-center items-end gap-[3px] w-4 h-3.5 shrink-0">
            <span className={`w-full h-[2px] rounded-full ${isYourTurn ? 'bg-[#93DD35]' : 'bg-[#C2CDC3]'}`} />
            <span className={`w-3/4 h-[2px] rounded-full ${isYourTurn ? 'bg-[#93DD35]' : 'bg-[#C2CDC3]'}`} />
            <span className={`w-full h-[2px] rounded-full ${isYourTurn ? 'bg-[#93DD35]' : 'bg-[#C2CDC3]'}`} />
          </div>
          <span className="truncate">Interrogation</span>
          {isYourTurn && status === 'game_started' && (
            <span className="text-[9px] bg-[#93DD35] text-[#111612] px-1.5 py-0.2 font-black tracking-wider">
              TURN
            </span>
          )}
        </button>
      </nav>

      {/* ── Mobile Drawers (Left: Match Intel, Right: Interrogation) ── */}
      {mobileDrawer && (
        <div
          className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
          onClick={() => setMobileDrawer(null)}
          aria-hidden="true"
        />
      )}

      {/* Left Drawer: Match Intel */}
      {mobileDrawer === 'intel' && secretCharacter && (
        <aside
          className="lg:hidden fixed inset-y-0 left-0 w-[88vw] max-w-sm bg-[#111612] border-r border-[#2E3830] z-40 flex flex-col shadow-2xl"
          role="dialog"
          aria-label="Match Intel"
        >
          <MatchIntelPanel
            isYourTurn={isYourTurn}
            logs={logs}
            secretCharacter={secretCharacter}
            waitingForAnswer={waitingForAnswer}
            opponentConnected={socketState.playerCount >= 2}
            onClose={() => setMobileDrawer(null)}
          />
        </aside>
      )}

      {/* Right Drawer: Interrogation */}
      {mobileDrawer === 'interrogation' && (
        <aside
          className="lg:hidden fixed inset-y-0 right-0 w-[88vw] max-w-sm bg-[#111612] border-l border-[#2E3830] z-40 flex flex-col shadow-2xl"
          role="dialog"
          aria-label="Interrogation"
        >
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
            onAskQuestion={(text) => {
              handleAskQuestion(text);
              setMobileDrawer(null);
            }}
            waitingForAnswer={waitingForAnswer}
            isOpponentEliminating={socketState.isOpponentEliminating}
            isEliminating={socketState.isEliminating}
            onDoneEliminating={() => {
              sendEliminationDone();
              setMobileDrawer(null);
            }}
            onClose={() => setMobileDrawer(null)}
          />
        </aside>
      )}

      {/* ── Guess Character Confirmation Modal ── */}
      {showGuessModal && guessCharacter && (
        <GuessConfirmModal
          character={guessCharacter}
          onCancel={() => setShowGuessModal(false)}
          onConfirm={() => {
            sendGuess(guessCharacter.id);
            setShowGuessModal(false);
          }}
        />
      )}

      {/* ── Game Over Overlay ── */}
      {gameOver && (
        <GameOverOverlay
          character={guessedCharacter}
          isWinner={isLocalPlayerWinner}
          correct={guessResult?.correct ?? false}
          onLeave={onLeaveRoom ?? (() => window.location.reload())}
        />
      )}
    </div>
  );
};

export default GameRoom;
