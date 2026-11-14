import React from 'react';
import type { ConnectionStatus } from '../../hooks/gameSocketTypes';

interface GameStatusBarProps {
  status: ConnectionStatus;
  playerCount: number;
  errorMessage: string | null;
  isYourTurn: boolean;
  waitingForAnswer: boolean;
  isEliminating: boolean;
  isOpponentEliminating: boolean;
  lastAnswer?: { answer: boolean } | null;
}

export const GameStatusBar: React.FC<GameStatusBarProps> = ({
  status,
  playerCount,
  errorMessage,
  isYourTurn,
  waitingForAnswer,
  isEliminating,
  isOpponentEliminating,
  lastAnswer,
}) => {
  // 1. Connection status banner (top banner below header)
  const connectionBanner = (() => {
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
            ? `CONNECTION ERROR${errorMessage ? ': ' + errorMessage : ''}`
            : 'DISCONNECTED — RECONNECTING...'}
        </div>
      );
    }

    if (status === 'waiting_for_opponent' || playerCount < 2) {
      return (
        <div className="shrink-0 text-center text-xs font-mono text-amber-400 py-1.5 border-b border-amber-500/20 bg-amber-500/5 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>WAITING FOR OPPONENT TO JOIN...</span>
        </div>
      );
    }

    return null;
  })();

  // 2. Mobile-only active game / turn status banner
  const mobileTurnBanner = (() => {
    if (status !== 'game_started' || playerCount < 2) return null;

    let dotClass = 'bg-[#C2CDC3]/40';
    let textClass = 'text-[#C2CDC3]';
    let label = "OPPONENT'S TURN";
    let hint = 'Waiting...';

    if (isEliminating) {
      dotClass = 'bg-[#93DD35] animate-ping';
      textClass = 'text-[#93DD35] font-bold tracking-wider';
      label = `✓ OPPONENT ANSWERED: ${lastAnswer?.answer ? 'YES' : 'NO'} · ELIMINATE CHARACTERS`;
      hint = 'Eliminate on board';
    } else if (isOpponentEliminating) {
      dotClass = 'bg-amber-400 animate-pulse';
      textClass = 'text-amber-300 font-bold';
      label = 'OPPONENT IS ELIMINATING CHARACTERS';
      hint = 'Watching live';
    } else if (waitingForAnswer) {
      dotClass = 'bg-amber-400 animate-pulse';
      textClass = 'text-amber-300 font-bold';
      label = 'WAITING FOR OPPONENT TO ANSWER...';
      hint = 'Please wait';
    } else if (isYourTurn) {
      dotClass = 'bg-[#93DD35] animate-pulse';
      textClass = 'text-[#93DD35] font-bold tracking-wider';
      label = 'YOUR TURN — SELECT QUESTION';
      hint = 'Select or Guess';
    }

    return (
      <div className="lg:hidden shrink-0 px-3 py-1.5 border-b border-[#2E3830] bg-[#171C18]/80 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
          <span className={`truncate ${textClass}`}>{label}</span>
        </div>
        <span className="text-[10px] text-[#C2CDC3]/60 uppercase tracking-wider shrink-0 ml-2">
          {hint}
        </span>
      </div>
    );
  })();

  return (
    <>
      {connectionBanner}
      {mobileTurnBanner}
    </>
  );
};

export default GameStatusBar;

