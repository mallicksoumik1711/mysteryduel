export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  // Attributes we might use for questions
  hasGlasses: boolean;
  hasBeard: boolean;
  hasHat: boolean;
  hairColor: string;
  eyeColor: string;
}

export type CharacterState = 'available' | 'selected' | 'eliminated';

// We map character IDs to their current state for the local player
export type BoardState = Record<string, CharacterState>;

export interface Player {
  id: string;
  name: string;
  isReady: boolean;
}

export interface GameState {
  id: string;
  status: 'waiting' | 'in_progress' | 'finished';
  players: Player[];
  currentTurnPlayerId: string | null;
  winnerId: string | null;
}
