export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  gender: 'male' | 'female';
  hasGlasses: boolean;
  hasBeard: boolean;
  hairColor: 'black' | 'brown' | 'blonde' | 'grey' | 'red';
  skinColor: 'light' | 'dark';
}

export type CharacterState = 'available' | 'selected' | 'eliminated';

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
