import React, { useEffect, useState, useCallback } from 'react';
import type { BoardState, Character } from '../types';
import { useCharacters } from '../hooks/useCharacters';
import { useQuestions } from '../hooks/useQuestions';
import { useGameSocket } from '../hooks/useGameSocket';
import {
  GameHeader,
  GameStatusBar,
  TacticalBoard,
  MatchIntelPanel,
  InterrogationPanel,
  MobileBottomNav,
  MobileDrawers,
  AnswerPrompt,
  GuessConfirmModal,
  GameOverOverlay,
} from './gameRoom/index';

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
  // Data hooks
  // ------------------------------------------------------------------
  const { characters, loadingCharacters, charactersError } = useCharacters();
  const { questions, loadingQuestions, questionsError } = useQuestions();

  // ------------------------------------------------------------------
  // WebSocket hook
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

  const {
    status,
    isYourTurn,
    pendingQuestion,
    waitingForAnswer,
    logs,
    guessResult,
    gameOver,
  } = socketState;

  // ------------------------------------------------------------------
  // Board & UI state
  // ------------------------------------------------------------------
  const [boardState, setBoardState] = useState<BoardState>({});
  const [activeBoardView, setActiveBoardView] = useState<'mine' | 'opponent'>('mine');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [guessCharacterId, setGuessCharacterId] = useState<string | null>(null);
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState<'intel' | 'interrogation' | null>(null);

  // Secret character reference
  const secretCharacter = userCharacter ?? characters[0] ?? null;

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

  // Register the player's secret character with the server once the socket is established
  useEffect(() => {
    if (
      (socketState.status === 'game_started' ||
        socketState.status === 'waiting_for_opponent' ||
        socketState.status === 'connected') &&
      secretCharacter
    ) {
      sendSetCharacter(secretCharacter.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketState.status, secretCharacter?.id]);

  // Handle board clicking: available -> selected -> eliminated -> available
  const handleCharacterClick = useCallback(
    (characterId: string) => {
      if (activeBoardView !== 'mine') return;

      setBoardState((prev) => {
        const currentState = prev[characterId] || 'available';
        let updatedBoardState: BoardState;

        if (currentState === 'available') {
          // Enforce single-selection
          const withPrevDeselected = Object.fromEntries(
            Object.entries(prev).map(([id, state]) =>
              state === 'selected' ? [id, 'available'] : [id, state],
            ),
          ) as BoardState;
          updatedBoardState = { ...withPrevDeselected, [characterId]: 'selected' };
          setGuessCharacterId(characterId);
        } else if (currentState === 'selected') {
          updatedBoardState = { ...prev, [characterId]: 'eliminated' };
          setGuessCharacterId(null);
        } else {
          updatedBoardState = { ...prev, [characterId]: 'available' };
        }

        sendBoardUpdate(updatedBoardState);
        return updatedBoardState;
      });
    },
    [activeBoardView, sendBoardUpdate],
  );

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

  // The board currently being displayed.
  const displayedBoardState =
    activeBoardView === 'mine' ? boardState : socketState.opponentBoard;

  // Resolve full character objects
  const guessCharacter = guessCharacterId
    ? characters.find((c) => c.id === guessCharacterId) ?? null
    : null;

  const guessedCharacter = guessResult
    ? characters.find((c) => c.id === guessResult.characterId) ?? null
    : null;

  const isLocalPlayerWinner =
    gameOver !== null && gameOver.winnerId === playerId;

  const canAskQuestion =
    isYourTurn &&
    !waitingForAnswer &&
    !pendingQuestion &&
    !socketState.isEliminating &&
    !socketState.isOpponentEliminating &&
    status === 'game_started';

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

      {/* Header */}
      <GameHeader roomId={roomId} onLeaveRoom={onLeaveRoom} />

      {/* Status Banners (Connection status & mobile turn alert) */}
      <GameStatusBar
        status={status}
        playerCount={socketState.playerCount}
        errorMessage={socketState.errorMessage}
        isYourTurn={isYourTurn}
        waitingForAnswer={waitingForAnswer}
        isEliminating={socketState.isEliminating}
        isOpponentEliminating={socketState.isOpponentEliminating}
        lastAnswer={socketState.lastAnswer}
      />

      {/* Answer prompt modal (when opponent asks current user a question) */}
      {pendingQuestion && (
        <AnswerPrompt
          questionText={pendingQuestion.questionText}
          onAnswer={handleAnswer}
          secretCharacter={secretCharacter}
        />
      )}

      {/* Main 3-column layout on Desktop, Tactical Board primary on Small Devices */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1800px] mx-auto p-2 sm:p-3 lg:p-4 flex flex-col lg:grid lg:grid-cols-12 gap-2 sm:gap-3 lg:gap-4 overflow-hidden">
        {secretCharacter && (
          <MatchIntelPanel
            className="hidden lg:flex lg:col-span-3"
            isYourTurn={isYourTurn}
            logs={logs}
            secretCharacter={secretCharacter}
            waitingForAnswer={waitingForAnswer}
            opponentConnected={socketState.playerCount >= 2}
            isEliminating={socketState.isEliminating}
          />
        )}

        <TacticalBoard
          activeBoardView={activeBoardView}
          onViewChange={setActiveBoardView}
          displayedBoardState={displayedBoardState}
          characters={characters}
          loadingCharacters={loadingCharacters}
          charactersError={charactersError}
          onCharacterClick={handleCharacterClick}
          guessCharacterId={guessCharacterId}
          gameOver={gameOver}
          onOpenGuessModal={() => guessCharacterId && setShowGuessModal(true)}
          isEliminating={socketState.isEliminating}
          isOpponentEliminating={socketState.isOpponentEliminating}
          onDoneEliminating={sendEliminationDone}
          playerCount={socketState.playerCount}
        />

        <InterrogationPanel
          className="hidden lg:flex lg:col-span-3"
          isYourTurn={canAskQuestion}
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

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeDrawer={mobileDrawer}
        onOpenDrawer={setMobileDrawer}
        logsCount={logs.length}
        isYourTurn={isYourTurn}
        gameStarted={status === 'game_started'}
        isEliminating={socketState.isEliminating}
        isOpponentEliminating={socketState.isOpponentEliminating}
        waitingForAnswer={waitingForAnswer}
        lastAnswer={socketState.lastAnswer}
      />

      {/* Mobile Drawers using the exact same MatchIntelPanel & InterrogationPanel */}
      <MobileDrawers
        activeDrawer={mobileDrawer}
        onClose={() => setMobileDrawer(null)}
        intelPanel={
          secretCharacter ? (
            <MatchIntelPanel
              isYourTurn={isYourTurn}
              logs={logs}
              secretCharacter={secretCharacter}
              waitingForAnswer={waitingForAnswer}
              opponentConnected={socketState.playerCount >= 2}
              onClose={() => setMobileDrawer(null)}
              isEliminating={socketState.isEliminating}
            />
          ) : null
        }
        interrogationPanel={
          <InterrogationPanel
            isYourTurn={canAskQuestion}
            questions={questions}
            loadingQuestions={loadingQuestions}
            questionsError={questionsError}
            selectedQuestion={selectedQuestion}
            onSelectQuestion={setSelectedQuestion}
            onAskQuestion={(text: string) => {
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
        }
      />

      {/* Guess Character Confirmation Modal */}
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

      {/* Game Over Overlay */}
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
