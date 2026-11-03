import React from 'react';
import type { Character } from '../../types';

interface CharacterInspectorProps {
  selected: Character | null;
  onConfirm: () => void;
}

// ─── Trait Row ────────────────────────────────────────────────────────────────

interface TraitRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const TraitRow: React.FC<TraitRowProps> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center bg-[#171C18]/60 p-2 border border-[#2E3830]">
    <span className="text-xs font-mono text-[#C2CDC3]">{label}</span>
    <span className={`text-xs font-mono font-bold ${highlight ? 'text-[#93DD35]' : 'text-[#FFFFFF]'}`}>
      {value}
    </span>
  </div>
);

// ─── CharacterInspector ───────────────────────────────────────────────────────

const CharacterInspector: React.FC<CharacterInspectorProps> = ({ selected, onConfirm }) => {
  return (
    <div className="lg:col-span-4 h-full flex flex-col justify-between border border-[#2E3830] p-5 backdrop-blur-sm shadow-2xl overflow-y-auto custom-scrollbar">

      {/* Inspector Details */}
      <div className="space-y-4">

        {/* Secret Character Display Window */}
        <div className="relative w-full aspect-[2/1] overflow-hidden border border-[#2E3830] bg-gradient-to-b from-[#2E3830]/50 to-[#171C18] flex items-center justify-center p-3 shadow-inner">
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
            <TraitRow
              label="NAME"
              value={selected ? selected.name.toUpperCase() : 'SELECT A CHARACTER'}
              highlight={!!selected}
            />
            <TraitRow
              label="GENDER"
              value={selected ? selected.gender.toUpperCase() : 'UNSELECTED'}
              highlight={!!selected}
            />
            <TraitRow
              label="EYEWEAR"
              value={selected ? (selected.hasGlasses ? 'PRESENT' : 'ABSENT') : 'SELECT A CHARACTER'}
              highlight={selected?.hasGlasses}
            />
            <TraitRow
              label="FACIAL HAIR"
              value={selected ? (selected.hasBeard ? 'PRESENT' : 'ABSENT') : 'SELECT A CHARACTER'}
              highlight={selected?.hasBeard}
            />
          </div>

          {/* Match Guidelines & Tactical Context */}
          <div className="p-3 bg-[#171C18]/80 border border-[#2E3830] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#93DD35]" />
              <span className="text-[10px] font-mono text-[#93DD35] uppercase tracking-wider">
                GAMEPLAY INSTRUCTIONS
              </span>
            </div>
            <p className="text-[11px] text-[#C2CDC3] leading-relaxed">
              Once confirmed, this chosen avatar remains strictly concealed. Your opponent will ask
              yes/no questions to narrow down your character's traits while you do the same to guess
              theirs.
            </p>
          </div>
        </div>

      </div>

      {/* Confirm & Play Action Button */}
      <div className="pt-3 border-t border-[#2E3830] mt-3">
        <button
          onClick={onConfirm}
          disabled={!selected}
          className={`w-full py-3.5 px-4 text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
            selected
              ? 'bg-[#93DD35] hover:bg-[#85c82e] text-[#171C18] shadow-lg shadow-[#93DD35]/20 active:scale-[0.98] cursor-pointer'
              : 'bg-[#2E3830] text-[#C2CDC3]/40 cursor-not-allowed shadow-none'
          }`}
        >
          <span>CONFIRM IDENTITY &amp; PLAY</span>
          <span className="text-sm">→</span>
        </button>
      </div>

    </div>
  );
};

export default CharacterInspector;

