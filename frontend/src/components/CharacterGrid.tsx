import React from 'react';
import type { Character, BoardState } from '../types';
import { CharacterCard } from './CharacterCard';

interface CharacterGridProps {
  characters: Character[];
  boardState: BoardState;
  onCharacterClick: (characterId: string) => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ 
  characters, 
  boardState, 
  onCharacterClick 
}) => {
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
};