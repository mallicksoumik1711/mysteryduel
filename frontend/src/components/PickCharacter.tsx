import React, { useState } from 'react';
import { mockCharacters } from '../data/mockCharacters';
import type { Character } from '../types';

interface PickCharacterProps {
  onConfirm: (character: Character) => void;
  onBack: () => void;
}

export const PickCharacter: React.FC<PickCharacterProps> = ({ onConfirm, onBack }) => {
  const [selected, setSelected] = useState<Character | null>(null);

  return (
    <div className="relative min-h-screen w-full bg-[#0f0608] text-zinc-100 font-sans flex flex-col items-center justify-start px-4 py-10 overflow-hidden select-none">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, #2b1018 0%, #0a0306 100%)',
        }}
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            ← Back
          </button>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Step 2 of 2
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pick Your Character</h1>
          <p className="text-xs text-zinc-400 mt-1">
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
                className={`group relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'bg-white/15 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/8 hover:border-white/25'
                }`}
              >
                {/* Selected ring pulse */}
                {isSelected && (
                  <span className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-pulse pointer-events-none" />
                )}

                {/* Avatar */}
                <div
                  className={`w-14 h-14 rounded-xl overflow-hidden border transition-all duration-200 ${
                    isSelected ? 'border-white/40' : 'border-white/10 group-hover:border-white/20'
                  }`}
                >
                  <img
                    src={char.imageUrl}
                    alt={char.name}
                    className="w-full h-full object-cover bg-zinc-900"
                  />
                </div>

                {/* Name */}
                <span
                  className={`text-[11px] font-medium text-center leading-tight transition-colors ${
                    isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  {char.name}
                </span>

                {/* Checkmark badge */}
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-zinc-950" fill="none" viewBox="0 0 10 10">
                      <path
                        d="M2 5l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
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
          className={`mt-2 rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 ${
            selected
              ? 'bg-white/5 border-white/15 opacity-100'
              : 'bg-white/[0.02] border-white/5 opacity-60'
          }`}
        >
          {/* Avatar preview */}
          <div className="w-12 h-16 rounded-xl overflow-hidden border border-white/20 bg-zinc-900 shrink-0">
            {selected ? (
              <img
                src={selected.imageUrl}
                alt={selected.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xl">
                ?
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-amber-400/80">
              Your Secret Character
            </span>
            <p className="text-sm font-semibold text-white mt-0.5 truncate">
              {selected ? selected.name : 'None selected'}
            </p>
            {selected && (
              <p className="text-[11px] text-zinc-400 mt-0.5">
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
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected}
            className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              selected
                ? 'bg-zinc-100 text-zinc-950 hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.12)] active:scale-95 cursor-pointer'
                : 'bg-white/5 text-zinc-600 cursor-not-allowed'
            }`}
          >
            Confirm & Play →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickCharacter;
