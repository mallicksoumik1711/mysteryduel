import React, { useEffect, useState } from 'react';
import { getAllCharacters } from '../services/characterService';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import PageHeader from '../components/pickCharacter/PageHeader';
import { CharacterGrid } from '../components/CharacterGrid';
import CharacterInspector from '../components/pickCharacter/CharacterInspector';
import type { Character } from '../types';

const PickCharacterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    roomCode: string;
    from: 'create-room' | 'join-room';
    playerName?: string;
  } | null;

  const playerIdRef = React.useRef<string>(
    state?.playerName
      ? state.playerName.toLowerCase().replace(/\s+/g, '-')
      : `${state?.from === 'create-room' ? 'host' : 'guest'}-${state?.roomCode ?? 'x'}`
  );

  const playerId = playerIdRef.current;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Character | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCharacters() {
      try {
        const data = await getAllCharacters();
        if (!cancelled) setCharacters(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load characters'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCharacters();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!state?.roomCode) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171C18] text-[#93DD35] flex items-center justify-center font-mono">
        LOADING CHARACTER DECK...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#171C18] text-white flex flex-col items-center justify-center gap-4 p-4">
        <p role="alert" className="text-red-400 text-center">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#93DD35] text-[#171C18]"
        >
          RETRY
        </button>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="min-h-screen bg-[#171C18] text-white flex items-center justify-center">
        No characters available.
      </div>
    );
  }

  const handleConfirm = () => {
    if (!selected) return;

    navigate('/game-room', {
      state: {
        roomCode: state.roomCode,
        character: selected,
        playerId,
      },
    });
  };

  return (
    <div
      className="
        relative min-h-screen lg:h-screen
        w-full bg-[#111612]
        text-white font-sans
        flex flex-col
        overflow-x-hidden
        bg-center bg-cover bg-fixed
        p-3 sm:p-4 md:p-6
        antialiased
      "
      style={{
        backgroundImage: `
          linear-gradient(rgba(4, 5, 4, 0.8), rgba(5, 8, 6, 0.92)),
          url('https://i.pinimg.com/736x/f5/e5/47/f5e5475127ab0cd4f9681e67fad5b623.jpg')
        `,
      }}
    >
      <NoiseOverlay />

      <div
        className="
          relative z-10 w-full
          min-h-[calc(100vh-1.5rem)]
          lg:h-full lg:min-h-0
          flex flex-col gap-3 sm:gap-4
        "
      >
        <PageHeader
          onBack={() => navigate(`/${state.from}`)}
          roomCode={state.roomCode}
        />

        <div
          className="
            flex-1 min-h-0
            grid grid-cols-1
            lg:grid-cols-12
            gap-3 sm:gap-4
            overflow-visible
            lg:overflow-hidden
          "
        >
          <div className="min-w-0 min-h-[420px] lg:min-h-0 lg:col-span-8">
            <CharacterGrid
              mode="pick"
              characters={characters}
              selected={selected}
              onSelect={setSelected}
            />
          </div>

          <div className="min-w-0 min-h-0 lg:col-span-4">
            <CharacterInspector
              selected={selected}
              onConfirm={handleConfirm}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickCharacterPage;
