import { useEffect, useState } from 'react';
import { getAllCharacters } from '../services/characterService';
import type { Character } from '../types';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [charactersError, setCharactersError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAllCharacters()
      .then((data) => {
        if (!cancelled) setCharacters(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setCharactersError(
            err instanceof Error ? err.message : 'Failed to load characters',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingCharacters(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { characters, loadingCharacters, charactersError };
}

