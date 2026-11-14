import React from 'react';
import type { BoardState, Character } from '../../types';
import { CharacterGrid } from '../CharacterGrid';

interface TacticalBoardProps {
  activeBoardView: 'mine' | 'opponent';
  onViewChange: (view: 'mine' | 'opponent') => void;
  displayedBoardState: BoardState;
  characters: Character[];
  loadingCharacters: boolean;
  charactersError: string | null;
  onCharacterClick: (characterId: string) => void;
  guessCharacterId: string | null;
  gameOver: unknown | null;
  onOpenGuessModal: () => void;
  isEliminating: boolean;
  isOpponentEliminating: boolean;
  onDoneEliminating: () => void;
  playerCount: number;
  className?: string;
}

export const TacticalBoard: React.FC<TacticalBoardProps> = ({
  activeBoardView,
  onViewChange,
  displayedBoardState,
  characters,
  loadingCharacters,
  charactersError,
  onCharacterClick,
  guessCharacterId,
  gameOver,
  onOpenGuessModal,
  isEliminating,
  isOpponentEliminating,
  onDoneEliminating,
  playerCount,
  className = '',
}) => {
  return (
    <section
      className={`flex-1 min-h-0 w-full flex flex-col border border-[#2E3830] bg-[#141A15]/95 backdrop-blur-md rounded-sm overflow-hidden lg:col-span-6 lg:h-full ${className}`}
    >
      {/* Tactical Board Header */}
      <div className="shrink-0 px-3 py-2 sm:px-3.5 sm:py-2.5 border-b border-[#2E3830] bg-[#171C18]/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-1.5 h-3.5 bg-[#93DD35] rounded-full shrink-0" />
          <h2 className="text-[10px] sm:text-[11px] font-bold text-[#FFFFFF] uppercase tracking-widest font-mono truncate">
            {activeBoardView === 'mine' ? 'My Tactical Board' : "Opponent's Board"}
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
            onClick={() => onViewChange('mine')}
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
            onClick={() => onViewChange('opponent')}
            aria-pressed={activeBoardView === 'opponent'}
            disabled={playerCount < 2}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono uppercase tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              activeBoardView === 'opponent'
                ? 'bg-[#93DD35] text-[#111612] font-bold'
                : 'bg-[#202621] text-[#C2CDC3] hover:bg-[#2E3830]'
            }`}
          >
            Opponent's Board
          </button>
        </div>

        {/* Guess Character — active when an avatar is selected */}
        <button
          type="button"
          id="guess-character-btn"
          disabled={!guessCharacterId || gameOver !== null}
          onClick={onOpenGuessModal}
          className={`px-2 sm:px-3 py-1.5 text-xs font-mono uppercase tracking-wide transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
            guessCharacterId && gameOver === null
              ? 'bg-[#93DD35] text-[#111612] font-black scale-[1.02]'
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
      {isEliminating && (
        <div className="shrink-0 px-3.5 py-2.5 bg-gradient-to-r from-[#93DD35]/20 via-[#171C18] to-[#93DD35]/10 border-b border-[#93DD35]/40 flex items-center justify-between gap-3 animate-fade-in">
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
            onClick={onDoneEliminating}
            className="shrink-0 px-3 py-1.5 bg-[#93DD35] hover:bg-[#85c82e] active:scale-[0.97] text-[#111612] font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Done Eliminating
          </button>
        </div>
      )}

      {/* Opponent Eliminating Notice Banner */}
      {isOpponentEliminating && (
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
          <p className="text-sm text-[#C2CDC3]">No characters available.</p>
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
              onCharacterClick={onCharacterClick}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default TacticalBoard;

