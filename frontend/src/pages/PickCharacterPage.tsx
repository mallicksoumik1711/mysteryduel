import React, { useEffect, useState } from 'react';
import { getAllCharacters } from '../services/characterService';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { NoiseOverlay } from '../components/ui/NoiseOverlay';
import type { Character } from '../types';

/**
 * PickCharacterPage
 *
 * Full-screen layout with side-by-side grid showcase and live character intelligence panel.
 * Uses 3:4 portrait cards inspired by 3D collectible avatar grids with zero heading tags.
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

  useEffect(() => {
    let cancelled = false;

    async function loadCharacters() {
      try {
        const data = await getAllCharacters();

        if (!cancelled) {
          setCharacters(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load characters'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCharacters();

    return () => {
      cancelled = true;
    };
  }, []);


  const [selected, setSelected] = useState<Character | null>(null);

  // Guard: if someone lands here directly without state, send them home
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
        <p role="alert" className="text-red-400">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-[#93DD35] text-[#171C18]"
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

  if (error) {
    return (
      <div className="h-screen bg-[#171C18] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-[#93DD35] text-[#171C18]"
        >
          RETRY
        </button>
      </div>
    );
  }

  const handleConfirm = () => {
    if (!selected) return;
    navigate('/game-room', { state: { roomCode: state.roomCode, character: selected, playerId } });
  };

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
      {/* Background Radial Ambient Layer */}
      {/* <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 20%, #202621 0%, #171C18 80%)',
        }}
      /> */}

      <NoiseOverlay />

      <div className="relative z-10 w-full h-full flex flex-col gap-4 overflow-hidden">

        {/* Top Control & Room Bar (No Headings) */}
        <div className="flex items-center justify-between shrink-0 backdrop-blur-sm border border-[#2E3830] rounded-lg px-4 py-3 shadow-lg">
          <button
            onClick={() => navigate(`/${state.from}`)}
            className="text-xs font-mono text-[#C2CDC3] hover:text-[#FFFFFF] transition-all flex items-center gap-2 cursor-pointer bg-[#2E3830]/60 hover:bg-[#2E3830] px-3.5 py-1.5 rounded-lg border border-[#2E3830]"
          >
            <span>←</span>
            <span>BACK</span>
          </button>

          <h1 className="londrina-solid-regular text-2xl font-black text-[#93DD35] tracking-widest uppercase">Pick a character</h1>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#171C18]/80 px-3 py-1 rounded-lg border border-[#2E3830] font-mono text-xs">
              <span className="text-[#C2CDC3]/60 uppercase text-[10px]">ROOM</span>
              <span className="text-[#93DD35] font-bold tracking-wider">{state.roomCode}</span>
            </div>

            <div className="flex items-center gap-2 bg-[#93DD35]/10 border border-[#93DD35]/30 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-[#93DD35] animate-pulse shadow-[0_0_8px_rgba(147,221,53,0.8)]" />
              <span className="text-[11px] font-mono font-bold text-[#93DD35] uppercase tracking-wider">
                STEP 2 / 2
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Split Viewport: 3D Grid Showcase + Live Identity Inspector Panel */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">

          {/* Character Showcase Grid (Inspired by 3D NFT Portrait Display) */}
          <div className="lg:col-span-8 h-full overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-8 xl:grid-cols-10 gap-3.5 pb-2">
              {characters.map((char) => {
                const isSelected = selected?.id === char.id;

                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => setSelected(char)}
                    className={`group relative flex flex-col rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer text-left focus:outline-none ${isSelected
                      ? 'bg-[#202621] border-[#93DD35] shadow-[0_0_25px_rgba(147,221,53,0.25)] ring-1 ring-[#93DD35]'
                      : 'bg-[#202621]/60 border-[#2E3830] hover:bg-[#202621] hover:border-[#93DD35]/50'
                      }`}
                  >
                    {/* 3D Portrait Box with Studio Backlight */}
                    <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#2E3830]/50 via-[#202621] to-[#171C18] overflow-hidden flex items-center justify-center p-2">

                      {/* Interactive Lighting Overlay */}
                      <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'opacity-100 bg-[radial-gradient(circle_at_center,rgba(147,221,53,0.2)_0%,transparent_70%)]' : 'opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]'}`} />

                      <img
                        src={char.imageUrl}
                        alt={char.name}
                        className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300 relative z-10"
                      />

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-[#93DD35] flex items-center justify-center shadow-md">
                          <svg className="w-3.5 h-3.5 text-[#171C18]" fill="none" viewBox="0 0 10 10">
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
                    </div>

                    {/* Card Label */}
                    <div className="p-2.5 bg-[#171C18]/70 border-t border-[#2E3830]/80 flex flex-col gap-0.5">
                      <span className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-[#93DD35]' : 'text-[#FFFFFF] group-hover:text-[#93DD35]'}`}>
                        {char.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Live Intelligence Inspector & Action Sidebar */}
          <div className="lg:col-span-4 h-full flex flex-col justify-between border border-[#2E3830] rounded-lg p-5 backdrop-blur-sm shadow-2xl overflow-y-auto custom-scrollbar">

            {/* Inspector Details */}
            <div className="space-y-4">

              {/* Secret Character Display Window */}
              <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden border border-[#2E3830] bg-gradient-to-b from-[#2E3830]/50 to-[#171C18] flex items-center justify-center p-3 shadow-inner">
                {selected ? (
                  <>
                    <img
                      src={selected.imageUrl}
                      alt={selected.name}
                      className="h-full object-contain z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,221,53,0.15)_0%,transparent_70%)]" />
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-[#2E3830]/50 border border-[#2E3830] flex items-center justify-center mx-auto mb-2 text-[#C2CDC3]/40 font-mono text-xl">
                      ?
                    </div>
                    <span className="text-xs font-mono text-[#C2CDC3]/60 uppercase tracking-widest block">
                      CLICK A CHARACTER TO INSPECT
                    </span>
                  </div>
                )}
              </div>

              {/* Trait Metadata & Analytics */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#2E3830] pb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#93DD35]">
                    SECRET IDENTITY METRICS
                  </span>
                  <span className="text-[10px] font-mono text-[#C2CDC3]/60">
                    {selected ? `ID #${selected.id}` : 'UNSELECTED'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center bg-[#171C18]/60 p-2 rounded-lg border border-[#2E3830]">
                    <span className="text-xs font-mono text-[#C2CDC3]">NAME</span>
                    <span className="text-xs font-bold text-[#FFFFFF] uppercase">
                      {selected ? selected.name : 'select a character'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-[#171C18]/60 p-2 rounded-lg border border-[#2E3830]">
                    <span className="text-xs font-mono text-[#C2CDC3]">
                      GENDER
                    </span>
                    <span className="text-xs font-mono font-bold text-[#93DD35]">
                      {selected ? selected.gender.toUpperCase() : 'UNSELECTED'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-[#171C18]/60 p-2 rounded-lg border border-[#2E3830]">
                    <span className="text-xs font-mono text-[#C2CDC3]">EYEWEAR</span>
                    <span className={`text-xs font-mono font-bold ${selected?.hasGlasses ? 'text-[#93DD35]' : 'text-[#C2CDC3]/40'}`}>
                      {selected ? (selected.hasGlasses ? 'PRESENT' : 'ABSENT') : 'select a character'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-[#171C18]/60 p-2 rounded-lg border border-[#2E3830]">
                    <span className="text-xs font-mono text-[#C2CDC3]">FACIAL HAIR</span>
                    <span className={`text-xs font-mono font-bold ${selected?.hasBeard ? 'text-[#93DD35]' : 'text-[#C2CDC3]/40'}`}>
                      {selected ? (selected.hasBeard ? 'PRESENT' : 'ABSENT') : 'select a character'}
                    </span>
                  </div>
                </div>

                {/* Match Guidelines & Tactical Context */}
                <div className="p-3 bg-[#171C18]/80 rounded-lg border border-[#2E3830] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#93DD35]" />
                    <span className="text-[10px] font-mono text-[#93DD35] uppercase tracking-wider">
                      GAMEPLAY INSTRUCTIONS
                    </span>
                  </div>
                  <p className="text-[11px] text-[#C2CDC3] leading-relaxed">
                    Once confirmed, this chosen avatar remains strictly concealed. Your opponent will ask yes/no questions to narrow down your character's traits while you do the same to guess theirs.
                  </p>
                </div>
              </div>

            </div>

            {/* Confirm & Play Action Button */}
            <div className="pt-3 border-t border-[#2E3830] mt-3">
              <button
                onClick={handleConfirm}
                disabled={!selected}
                className={`w-full py-3.5 px-4 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${selected
                  ? 'bg-[#93DD35] hover:bg-[#85c82e] text-[#171C18] shadow-lg shadow-[#93DD35]/20 active:scale-[0.98] cursor-pointer'
                  : 'bg-[#2E3830] text-[#C2CDC3]/40 cursor-not-allowed shadow-none'
                  }`}
              >
                <span>CONFIRM IDENTITY & PLAY</span>
                <span className="text-sm">→</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PickCharacterPage;