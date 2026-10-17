import React from 'react';
import type { Character, CharacterState } from '../types';

interface CharacterCardProps {
  character: Character;
  state: CharacterState;
  onClick: (characterId: string) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, state, onClick }) => {
  const isSelected = state === 'selected';
  const isEliminated = state === 'eliminated';

  let containerStyles = 'bg-[#202621]/60 border-[#2E3830] hover:bg-[#202621] hover:border-[#93DD35]/50';
  let opacity = 'opacity-100';

  if (isSelected) {
    containerStyles = 'bg-[#202621] border-[#93DD35] shadow-[0_0_20px_rgba(147,221,53,0.3)] ring-1 ring-[#93DD35]';
  } else if (isEliminated) {
    containerStyles = 'border-[#2E3830]/40 bg-[#171C18]/90 grayscale';
    opacity = 'opacity-35';
  }

  return (
    <button
      type="button"
      onClick={() => onClick(character.id)}
      className={`
        group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200 
        cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#93DD35]/50
        w-full ${containerStyles} ${opacity}
      `}
      aria-label={`${character.name} - ${state}`}
      aria-pressed={isSelected}
    >
      {/* 3D Portrait Box with Studio Backlight */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#2E3830]/50 via-[#202621] to-[#171C18] overflow-hidden flex items-center justify-center p-1.5 sm:p-2">
        
        {/* Interactive Lighting Overlay */}
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${
            isSelected 
              ? 'opacity-100 bg-[radial-gradient(circle_at_center,rgba(147,221,53,0.25)_0%,transparent_70%)]' 
              : 'opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]'
          }`} 
        />

        <img
          src={character.imageUrl}
          alt={character.name}
          className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300 relative z-10"
          loading="lazy"
        />

        {/* Selected Checkmark Badge */}
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#93DD35] flex items-center justify-center shadow-md shadow-black/50">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#171C18]" fill="none" viewBox="0 0 10 10">
              <path
                d="M2 5l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Eliminated Overlay */}
        {isEliminated && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-black/40">
            <div className="w-full h-1 bg-red-500/90 -rotate-45 absolute shadow-md shadow-black" />
            <div className="w-full h-1 bg-red-500/90 rotate-45 absolute shadow-md shadow-black" />
          </div>
        )}
      </div>

      {/* Card Label */}
      <div className="p-1.5 sm:p-2 bg-[#171C18]/80 border-t border-[#2E3830]/80 flex flex-col justify-center">
        <span className={`text-[10px] sm:text-xs font-bold truncate text-center transition-colors ${
          isSelected ? 'text-[#93DD35]' : isEliminated ? 'text-[#C2CDC3]/50 line-through' : 'text-[#FFFFFF] group-hover:text-[#93DD35]'
        }`}>
          {character.name}
        </span>
      </div>
    </button>
  );
};