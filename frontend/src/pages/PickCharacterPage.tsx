import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { mockCharacters } from '../data/mockCharacters';
import type { Character } from '../types';

/**
 * PickCharacterPage
 *
 * Expects location.state = { roomCode: string, from: 'create-room' | 'join-room' }
 * passed by CreateRoomPage or JoinRoomPage via navigate().
 *
 * On confirm → navigates to /game-room with { roomCode, character } in state.
 * On back    → navigates back to the originating page.
 */
const PickCharacterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { roomCode: string; from: 'create-room' | 'join-room' } | null;

  const [selected, setSelected] = useState<Character | null>(null);

  // Guard: if someone lands here directly without state, send them home
  if (!state?.roomCode) {
    return <Navigate to="/" replace />;
  }

  const handleConfirm = () => {
    if (!selected) return;
    navigate('/game-room', { state: { roomCode: state.roomCode, character: selected } });
  };

  return (
    // Background: Rangoon Green (#171C18)
    <div className="relative min-h-screen w-full bg-[#171C18] text-[#FFFFFF] font-sans flex flex-col items-center justify-start px-4 py-10 overflow-hidden select-none">
      
      {/* Background Radial Gradient */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #202621 0%, #171C18 100%)' }}
      />

      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      <div className="relative z-10 w-full max-w-3xl flex flex-col gap-6">
        
        {/* Header navigation & step */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/${state.from}`)}
            className="text-xs font-mono text-[#C2CDC3] hover:text-[#FFFFFF] transition-all flex items-center gap-1.5 cursor-pointer bg-[#2E3830]/50 hover:bg-[#2E3830] px-3 py-1.5 rounded-lg border border-[#2E3830]"
          >
            <span>←</span>
            <span>BACK</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#93DD35] animate-pulse shadow-[0_0_8px_rgba(147,221,53,0.8)]" />
            <span className="text-[10px] font-mono font-bold text-[#93DD35] uppercase tracking-widest">
              Step 2 of 2 · Character Selection
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black text-[#FFFFFF] tracking-wide uppercase">Pick Your Character</h1>
          <p className="text-xs text-[#C2CDC3] mt-1">
            Choose your secret identity. Your opponent will try to guess who you are.
          </p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {mockCharacters.map((char) => {
            const isSelected = selected?.id === char.id;
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => setSelected(char)}
                className={`group relative flex flex-col items-center gap-2 p-3 rounded-md border transition-all duration-200 cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'bg-[#93DD35]/15 border-[#93DD35]/60 shadow-[0_0_20px_rgba(147,221,53,0.2)]'
                    : 'bg-[#202621]/80 border-[#2E3830] hover:bg-[#202621] hover:border-[#93DD35]/40'
                }`}
              >
                {/* Selected ring pulse */}
                {isSelected && (
                  <span className="absolute inset-0 rounded-md border-1 border-[#93DD35] animate-pulse pointer-events-none" />
                )}

                {/* Avatar */}
                <div
                  className={`w-14 h-14 rounded-md overflow-hidden border transition-all duration-200 ${
                    isSelected ? 'border-[#93DD35]' : 'border-[#2E3830] group-hover:border-[#93DD35]/40'
                  }`}
                >
                  <img
                    src={char.imageUrl}
                    alt={char.name}
                    className="w-full h-full object-cover bg-[#171C18]"
                  />
                </div>

                {/* Name */}
                <span
                  className={`text-[11px] font-bold text-center leading-tight transition-colors ${
                    isSelected ? 'text-[#FFFFFF]' : 'text-[#C2CDC3] group-hover:text-[#FFFFFF]'
                  }`}
                >
                  {char.name}
                </span>

                {/* Checkmark badge */}
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#93DD35] flex items-center justify-center shadow-md">
                    <svg className="w-2.5 h-2.5 text-[#171C18]" fill="none" viewBox="0 0 10 10">
                      <path
                        d="M2 5l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selection Preview + Confirm */}
        <div
          className={`mt-2 rounded-md border p-4 flex items-center gap-4 transition-all duration-300 ${
            selected
              ? 'bg-[#202621] border-[#93DD35]/40 opacity-100 shadow-lg shadow-black/40'
              : 'bg-[#202621]/60 border-[#2E3830] opacity-60'
          }`}
        >
          {/* Avatar preview */}
          <div className="w-12 h-16 rounded-lg overflow-hidden border border-[#2E3830] bg-[#171C18] shrink-0">
            {selected ? (
              <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#C2CDC3]/40 text-xl font-mono">?</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[#93DD35]">
              Your Secret Character
            </span>
            <p className="text-sm font-black text-[#FFFFFF] mt-0.5 truncate uppercase">
              {selected ? selected.name : 'None selected'}
            </p>
            {selected && (
              <p className="text-[11px] text-[#C2CDC3] mt-0.5 font-mono">
                {[
                  selected.hasGlasses && 'Glasses',
                  selected.hasBeard && 'Beard',
                  selected.hasHat && 'Hat',
                ]
                  .filter(Boolean)
                  .join(' · ') || 'No accessories'}
              </p>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={`shrink-0 px-5 py-3 rounded-md text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center gap-2 ${
              selected
                ? 'bg-[#93DD35] hover:bg-[#85c82e] text-[#171C18] shadow-lg shadow-[#93DD35]/25 active:scale-98 cursor-pointer'
                : 'bg-[#2E3830] text-[#C2CDC3]/40 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Confirm & Play</span>
            <span className={selected ? 'text-[#171C18]' : 'text-[#C2CDC3]/40'}>→</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PickCharacterPage;