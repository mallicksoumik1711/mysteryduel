import React from 'react';
import type { Character, BoardState } from '../types';
import { CharacterCard } from './CharacterCard';

// ─── Mode: "board" (in-game, supports eliminated/selected states via BoardState)
interface BoardModeProps {
  mode: 'board';
  characters: Character[];
  boardState: BoardState;
  onCharacterClick: (characterId: string) => void;
}

// ─── Mode: "pick" (character selection screen, single selected character)
interface PickModeProps {
  mode: 'pick';
  characters: Character[];
  selected: Character | null;
  onSelect: (character: Character) => void;
}

type CharacterGridProps = BoardModeProps | PickModeProps;

// ─── Pick-mode card (inline, no eliminated state needed) ──────────────────────

interface PickCardProps {
  char: Character;
  isSelected: boolean;
  onSelect: (character: Character) => void;
}

const PickCard: React.FC<PickCardProps> = ({ char, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(char)}
    className={`group relative flex flex-col overflow-hidden border transition-all duration-200 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#93DD35]/50 w-full ${
      isSelected
        ? 'bg-[#202621] border-[#93DD35] shadow-[0_0_25px_rgba(147,221,53,0.25)] ring-1 ring-[#93DD35]'
        : 'bg-[#202621]/60 border-[#2E3830] hover:bg-[#202621] hover:border-[#93DD35]/50'
    }`}
    aria-label={`${char.name}${isSelected ? ' - selected' : ''}`}
    aria-pressed={isSelected}
  >
    {/* Portrait with Studio Backlight */}
    <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#2E3830]/50 via-[#202621] to-[#171C18] overflow-hidden flex items-center justify-center p-1.5 sm:p-2">

      {/* Lighting Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isSelected
            ? 'opacity-100 bg-[radial-gradient(circle_at_center,rgba(147,221,53,0.2)_0%,transparent_70%)]'
            : 'opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]'
        }`}
      />

      <img
        src={char.imageUrl}
        alt={char.name}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300 relative z-10"
        loading="lazy"
      />

      {/* Checkmark Badge */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#93DD35] flex items-center justify-center shadow-md shadow-black/50">
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#171C18]" fill="none" viewBox="0 0 10 10">
            <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>

    {/* Card Label */}
    <div className="p-1.5 sm:p-2 bg-[#171C18]/80 border-t border-[#2E3830]/80 flex flex-col justify-center">
      <span
        className={`text-[10px] sm:text-xs font-bold truncate text-center transition-colors ${
          isSelected ? 'text-[#93DD35]' : 'text-[#FFFFFF] group-hover:text-[#93DD35]'
        }`}
      >
        {char.name}
      </span>
    </div>
  </button>
);

// ─── CharacterGrid ────────────────────────────────────────────────────────────

export const CharacterGrid: React.FC<CharacterGridProps> = (props) => {
  if (props.mode === 'board') {
    const { characters, boardState, onCharacterClick } = props;
    return (
      <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-8 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 sm:gap-3 pb-2">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            state={boardState[character.id] || 'available'}
            onClick={onCharacterClick}
          />
        ))}
      </div>
    );
  }

  // mode === 'pick'
  const { characters, selected, onSelect } = props;
  return (
    <div className="lg:col-span-8 h-full overflow-y-auto pr-1 custom-scrollbar">
      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-8 xl:grid-cols-10 gap-3.5 pb-2">
        {characters.map((char) => (
          <PickCard
            key={char.id}
            char={char}
            isSelected={selected?.id === char.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterGrid;
