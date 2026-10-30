import React from 'react';
import type { Character } from '../../types';

interface GuessConfirmModalProps {
  character: Character;
  onConfirm: () => void;
  onCancel: () => void;
}

// ── Small helpers ────────────────────────────────────────────────────────────

function TraitBadge({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-0.5 px-3 py-2   border text-center min-w-[72px] ${accent
        ? 'border-[#93DD35]/40 bg-[#93DD35]/10'
        : 'border-[#2E3830] bg-[#1A201B]'
        }`}
    >
      <span className="text-[9px] font-mono uppercase tracking-widest text-[#C2CDC3]/60">
        {label}
      </span>
      <span
        className={`text-xs font-bold capitalize ${accent ? 'text-[#93DD35]' : 'text-[#E8F0E9]'
          }`}
      >
        {value}
      </span>
    </div>
  );
}

function BoolBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-2   border text-xs font-mono ${value
        ? 'border-[#93DD35]/40 bg-[#93DD35]/10 text-[#93DD35]'
        : 'border-[#2E3830] bg-[#1A201B] text-[#C2CDC3]/50 line-through'
        }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${value ? 'bg-[#93DD35]' : 'bg-[#C2CDC3]/30'}`} />
      {label}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export const GuessConfirmModal: React.FC<GuessConfirmModalProps> = ({
  character,
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guess-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md   border border-[#2E3830] bg-[#141A15] shadow-[0_0_80px_rgba(147,221,53,0.14)] overflow-hidden">
        {/* Top accent bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#93DD35]/0 via-[#93DD35] to-[#93DD35]/0" />

        <div className="px-7 pt-7 pb-8 flex flex-col items-center text-center gap-6">

          {/* ── Avatar ── */}
          <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-[#93DD35]/60 shadow-[0_0_28px_rgba(147,221,53,0.3)] shrink-0">
            <img
              src={character.imageUrl}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* ── Identity ── */}
          <div className="space-y-1">
            <p
              id="guess-modal-title"
              className="text-[10px] font-mono uppercase tracking-widest text-[#93DD35]"
            >
              Final Guess · Suspect Profile
            </p>
            <h3 className="text-2xl font-black text-white tracking-wider londrina-solid-regular">
              {character.name}
            </h3>
            <p className="text-sm text-[#C2CDC3]/70 leading-relaxed max-w-xs mx-auto">
              You are about to lock in your guess. If you're correct, you win the round!
            </p>
          </div>

          {/* ── Trait Grid ── */}
          <div className="w-full space-y-3">
            <p className="text-[9px] font-mono uppercase tracking-widest text-[#C2CDC3]/40 text-left">
              Character Traits
            </p>

            {/* Row 1: core traits */}
            <div className="flex flex-wrap justify-center gap-2">
              <TraitBadge label="Gender" value={character.gender} accent />
              <TraitBadge label="Hair" value={character.hairColor} />
              <TraitBadge label="Skin" value={character.skinColor} />
            </div>

            {/* Row 2: boolean traits */}
            <div className="flex flex-wrap justify-center gap-2">
              <BoolBadge label="Glasses" value={character.hasGlasses} />
              <BoolBadge label="Beard" value={character.hasBeard} />
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="w-full border-t border-[#2E3830]" />

          {/* ── Actions ── */}
          <div className="flex gap-3 w-full londrina-solid-regular">
            <button
              type="button"
              id="guess-modal-cancel-btn"
              onClick={onCancel}
              className="flex-1 py-3 border border-[#2E3830] bg-[#202621] text-[#C2CDC3] text-xl font-mono uppercase tracking-wide hover:bg-[#2E3830] active:scale-[0.97] transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              id="guess-modal-confirm-btn"
              onClick={onConfirm}
              className="flex-1 py-3 bg-[#93DD35] hover:bg-[#85c82e] active:scale-[0.97] text-[#111612] text-xl font-black uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(147,221,53,0.35)]"
            >
              Yes, Guess!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuessConfirmModal;
