import React from 'react';
import type { Character } from '../../types';

interface CharacterInspectorProps {
  selected: Character | null;
  onConfirm: () => void;
}

interface TraitRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const TraitRow: React.FC<TraitRowProps> = ({
  label,
  value,
  highlight,
}) => (
  <div className="flex justify-between items-center gap-2 bg-[#171C18]/60 p-2 sm:p-2.5 border border-[#2E3830]">
    <span className="text-[10px] sm:text-xs font-mono text-[#C2CDC3] shrink-0">
      {label}
    </span>

    <span
      className={`text-[10px] sm:text-xs font-mono font-bold text-right break-words min-w-0 ${
        highlight ? 'text-[#93DD35]' : 'text-white'
      }`}
    >
      {value}
    </span>
  </div>
);

const CharacterInspector: React.FC<CharacterInspectorProps> = ({
  selected,
  onConfirm,
}) => {
  return (
    <div
      className="
        w-full h-auto
        lg:h-full
        flex flex-col justify-between
        border border-[#2E3830]
        p-3 sm:p-4 lg:p-5
        backdrop-blur-sm shadow-2xl
        overflow-visible
        lg:overflow-y-auto
        custom-scrollbar
        gap-4
      "
    >
      <div className="space-y-3 sm:space-y-4">

        {/* Character Preview */}
        <div
          className="
            relative w-full
            aspect-[2/1]
            sm:aspect-[2.5/1]
            lg:aspect-[2/1]
            overflow-hidden
            border border-[#2E3830]
            bg-gradient-to-b from-[#2E3830]/50 to-[#171C18]
            flex items-center justify-center
            p-3 shadow-inner
          "
        >
          {selected ? (
            <>
              <img
                src={selected.imageUrl}
                alt={selected.name}
                className="
                  relative z-10
                  max-w-full max-h-full
                  w-auto h-full
                  object-contain
                  drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]
                "
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,221,53,0.15)_0%,transparent_70%)]" />
            </>
          ) : (
            <div className="text-center p-3 sm:p-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2E3830]/50 border border-[#2E3830] flex items-center justify-center mx-auto mb-2 text-[#C2CDC3]/40 font-mono text-xl">
                ?
              </div>

              <span className="text-[10px] sm:text-xs font-mono text-[#C2CDC3]/60 uppercase tracking-widest block">
                CLICK A CHARACTER TO INSPECT
              </span>
            </div>
          )}
        </div>

        {/* Character Metadata */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 border-b border-[#2E3830] pb-2">
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#93DD35]">
              SECRET IDENTITY METRICS
            </span>

            <span className="text-[9px] sm:text-[10px] font-mono text-[#C2CDC3]/60 shrink-0">
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
              value={
                selected
                  ? selected.hasGlasses
                    ? 'PRESENT'
                    : 'ABSENT'
                  : 'SELECT A CHARACTER'
              }
              highlight={selected?.hasGlasses}
            />

            <TraitRow
              label="FACIAL HAIR"
              value={
                selected
                  ? selected.hasBeard
                    ? 'PRESENT'
                    : 'ABSENT'
                  : 'SELECT A CHARACTER'
              }
              highlight={selected?.hasBeard}
            />
          </div>

          {/* Gameplay Instructions */}
          <div className="p-3 bg-[#171C18]/80 border border-[#2E3830] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#93DD35] shrink-0" />

              <span className="text-[9px] sm:text-[10px] font-mono text-[#93DD35] uppercase tracking-wider">
                GAMEPLAY INSTRUCTIONS
              </span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-[#C2CDC3] leading-relaxed">
              Once confirmed, this chosen avatar remains strictly concealed.
              Your opponent will ask yes/no questions to narrow down your
              character's traits while you do the same to guess theirs.
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="pt-3 border-t border-[#2E3830] mt-auto">
        <button
          onClick={onConfirm}
          disabled={!selected}
          className={`w-full min-h-[44px] py-3 sm:py-3.5 px-3 sm:px-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
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
