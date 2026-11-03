import React, { useEffect, useState } from 'react';
import { getAllCharacters } from '../services/characterService';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import PageHeader from '../components/pickCharacter/PageHeader';
import { CharacterGrid } from '../components/CharacterGrid';
import CharacterInspector from '../components/pickCharacter/CharacterInspector';
import type { Character } from '../types';

/**
 * PickCharacterPage
 *
 * Thin orchestrator: owns data-fetching state, selection state, and navigation.
 * All UI is delegated to focused sub-components in /components/pickCharacter/.
 */
const PickCharacterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { roomCode: string; from: 'create-room' | 'join-room'; playerName?: string } | null;

  // Stable player ID for this session – derived from room + join source so it
  // stays the same if this component re-renders (e.g. on HMR).
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
          setError(err instanceof Error ? err.message : 'Failed to load characters');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCharacters();
    return () => { cancelled = true; };
  }, []);

  // ── Guards ────────────────────────────────────────────────────────────────

  if (!state?.roomCode) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#171C18] text-[#93DD35] flex items-center justify-center font-mono">
        LOADING CHARACTER DECK...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#171C18] text-white flex flex-col items-center justify-center gap-4">
        <p role="alert" className="text-red-400">{error}</p>
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
      <div className="h-screen bg-[#171C18] text-white flex items-center justify-center">
        No characters available.
      </div>
    );
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleConfirm = () => {
    if (!selected) return;
    navigate('/game-room', { state: { roomCode: state.roomCode, character: selected, playerId } });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="relative h-screen w-full bg-[#111612] text-[#FFFFFF] font-sans flex flex-col overflow-hidden bg-center p-4 sm:p-6 antialiased"
      style={{
        backgroundImage: `
        linear-gradient(rgba(4, 5, 4, 0.8), rgba(5, 8, 6, 0.92)),
        url('https://i.pinimg.com/736x/f5/e5/47/f5e5475127ab0cd4f9681e67fad5b623.jpg')
      `,
      }}
    >
      <NoiseOverlay />

      <div className="relative z-10 w-full h-full flex flex-col gap-4 overflow-hidden">

        <PageHeader
          onBack={() => navigate(`/${state.from}`)}
          roomCode={state.roomCode}
        />

        {/* Dashboard Split Viewport: 3D Grid Showcase + Live Identity Inspector Panel */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
          <CharacterGrid
            mode="pick"
            characters={characters}
            selected={selected}
            onSelect={setSelected}
          />
          <CharacterInspector
            selected={selected}
            onConfirm={handleConfirm}
          />
        </div>

      </div>
    </div>
  );
};

export default PickCharacterPage;
