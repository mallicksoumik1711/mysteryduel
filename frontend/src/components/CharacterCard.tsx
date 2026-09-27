import React from 'react';
import type { Character, CharacterState } from '../types';

interface CharacterCardProps {
  character: Character;
  state: CharacterState;
  onClick: (characterId: string) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, state, onClick }) => {
  let stateStyles = 'border-[#2E3830] bg-[#202621]/80 hover:border-[#93DD35]/50 hover:bg-[#202621] shadow-[0_4px_20px_rgba(0,0,0,0.5)]';
  let opacity = 'opacity-100';

  if (state === 'selected') {
    stateStyles = 'border-[#93DD35] bg-[#93DD35]/15 shadow-[0_0_20px_rgba(147,221,53,0.3)]';
  } else if (state === 'eliminated') {
    stateStyles = 'border-[#2E3830]/50 bg-[#171C18]/90 grayscale';
    opacity = 'opacity-30';
  }

  return (
    <button
      onClick={() => onClick(character.id)}
      className={`
        relative flex flex-col items-center justify-center 
        p-4 rounded-md border transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#93DD35]/50
        w-full aspect-[3/4] cursor-pointer backdrop-blur-sm
        ${stateStyles}
        ${opacity}
      `}
      aria-label={`${character.name} - ${state}`}
      aria-pressed={state === 'selected'}
    >
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden mb-3 p-1 rounded-md bg-[#171C18] border border-[#2E3830]">
        <img 
          src={character.imageUrl} 
          alt={`Portrait of ${character.name}`} 
          className="w-24 h-24 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          loading="lazy"
        />
      </div>
      
      <div className="w-full text-center">
        <h3 className="font-bold text-[#FFFFFF] text-sm tracking-wide truncate uppercase">
          {character.name}
        </h3>
      </div>

      {state === 'eliminated' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-0.5 bg-[#93DD35]/80 -rotate-45 absolute rounded-full shadow-md shadow-black"></div>
          <div className="w-full h-0.5 bg-[#93DD35]/80 rotate-45 absolute rounded-full shadow-md shadow-black"></div>
        </div>
      )}
    </button>
  );
};