import React from 'react';
import type { Character, CharacterState } from '../types';

interface CharacterCardProps {
  character: Character;
  state: CharacterState;
  onClick: (characterId: string) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, state, onClick }) => {
  // Determine styles based on character state matching DESIGN.md
  let stateStyles = 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]';
  let opacity = 'opacity-100';

  if (state === 'selected') {
    stateStyles = 'border-rose-500/80 bg-rose-950/30 ring-2 ring-rose-500/60 ring-offset-2 ring-offset-[#0f0608] shadow-[0_0_20px_rgba(225,29,72,0.3)]';
  } else if (state === 'eliminated') {
    stateStyles = 'border-white/5 bg-zinc-950/80 grayscale';
    opacity = 'opacity-30';
  }

  return (
    <button
      onClick={() => onClick(character.id)}
      className={`
        relative flex flex-col items-center justify-center 
        p-4 rounded-xl border transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
        w-full aspect-[3/4] cursor-pointer backdrop-blur-sm
        ${stateStyles}
        ${opacity}
      `}
      aria-label={`${character.name} - ${state}`}
      aria-pressed={state === 'selected'}
    >
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden mb-3 p-1 rounded-xl bg-black/40 border border-white/10">
        <img 
          src={character.imageUrl} 
          alt={`Portrait of ${character.name}`} 
          className="w-24 h-24 object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          loading="lazy"
        />
      </div>
      
      <div className="w-full text-center">
        <h3 className="font-semibold text-zinc-100 text-sm tracking-wide truncate">
          {character.name}
        </h3>
      </div>

      {state === 'eliminated' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-0.5 bg-rose-500/80 -rotate-45 absolute rounded-full shadow-md shadow-rose-950"></div>
          <div className="w-full h-0.5 bg-rose-500/80 rotate-45 absolute rounded-full shadow-md shadow-rose-950"></div>
        </div>
      )}
    </button>
  );
};


