
import type { Character } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

interface ApiCharacter {
  id: string;
  name: string;
  image_url: string;
  gender: 'male' | 'female';
  has_glasses: boolean;
  has_beard: boolean;
  hair_color: 'black' | 'brown' | 'blonde' | 'grey' | 'red';
  skin_color: 'light' | 'dark';
}

export async function getAllCharacters(): Promise<Character[]> {
  const response = await fetch(`${API_BASE_URL}/characters/`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch characters: HTTP ${response.status}`
    );
  }

  const data: ApiCharacter[] = await response.json();

  return data.map((char) => ({
    id: char.id,
    name: char.name,
    imageUrl: char.image_url,
    gender: char.gender,
    hasGlasses: char.has_glasses,
    hasBeard: char.has_beard,
    hairColor: char.hair_color,
    skinColor: char.skin_color,
  }));
}
