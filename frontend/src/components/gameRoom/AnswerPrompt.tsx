/**
 * AnswerPrompt
 * ============
 * A modal-style overlay that appears when the opponent has asked you a question.
 * Blocks interaction with the board until you answer Yes or No.
 * Shows your secret character so you can answer truthfully.
 */

import React from 'react';
import type { Character } from '../../types';

interface AnswerPromptProps {
  questionText: string;
  onAnswer: (answer: boolean) => void;
  secretCharacter?: Character | null;
}

export const AnswerPrompt: React.FC<AnswerPromptProps> = ({
  questionText,
  onAnswer,
  secretCharacter,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: 'rgba(10, 14, 11, 0.85)', backdropFilter: 'blur(8px)' }}
    role="dialog"
    aria-modal="true"
    aria-label="Answer your opponent's question"
  >
    {/* Glow ring */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#93DD35]/8 blur-[120px]" />
    </div>

    <div className="relative w-full max-w-md mx-4 rounded-lg border border-[#93DD35]/40 bg-gradient-to-b from-[#1a2119] to-[#111612] shadow-2xl shadow-[#93DD35]/10 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#93DD35] to-transparent" />

      <div className="p-6 flex flex-col items-center gap-5">
        {/* Label */}
        <div className="text-center space-y-1">
          <span className="block text-[10px] font-mono font-bold text-[#93DD35] uppercase tracking-[0.2em]">
            Opponent's Question
          </span>
          <p className="text-base font-bold text-[#FFFFFF] leading-snug text-center px-2">
            {questionText}
          </p>
        </div>

        {/* Secret character reminder */}
        {secretCharacter && (
          <div className="w-full rounded-md border border-[#93DD35]/20 bg-[#0d1210]/60 p-3 flex items-center gap-3">
            {/* Avatar */}
            <div className="relative shrink-0 w-25 h-25 rounded-md overflow-hidden border border-[#93DD35]/30 shadow-[0_0_14px_rgba(147,221,53,0.2)]">
              <img
                src={secretCharacter.imageUrl}
                alt={secretCharacter.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#93DD35]/10 mix-blend-color-dodge" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-mono text-[#93DD35] uppercase tracking-[0.18em] mb-0.5">
                Your Secret Character
              </p>
              <p className="text-sm font-black text-white truncate">{secretCharacter.name}</p>

              {/* Attribute pills */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                <span className="px-1.5 py-0.5 rounded-full bg-[#93DD35]/10 border border-[#93DD35]/20 text-[9px] font-mono text-[#93DD35] capitalize">
                  {secretCharacter.gender}
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#93DD35]/10 border border-[#93DD35]/20 text-[9px] font-mono text-[#93DD35] capitalize">
                  {secretCharacter.hairColor} hair
                </span>
                {secretCharacter.hasGlasses && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#93DD35]/10 border border-[#93DD35]/20 text-[9px] font-mono text-[#93DD35]">
                    glasses
                  </span>
                )}
                {secretCharacter.hasBeard && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#93DD35]/10 border border-[#93DD35]/20 text-[9px] font-mono text-[#93DD35]">
                    beard
                  </span>
                )}
              </div>
            </div>

            {/* Lock icon */}
            <div className="shrink-0 w-7 h-7 rounded-full bg-[#93DD35]/10 border border-[#93DD35]/20 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#93DD35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        )}

        {/* Answer buttons */}
        <div className="flex gap-3 w-full">
          <button
            id="answer-yes-btn"
            onClick={() => onAnswer(true)}
            className="flex-1 py-3 rounded-xl bg-[#93DD35] hover:bg-[#7ec82b] active:scale-[0.97] text-[#111612] font-black text-sm uppercase tracking-widest transition-all duration-150 shadow-lg shadow-[#93DD35]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Yes
          </button>

          <button
            id="answer-no-btn"
            onClick={() => onAnswer(false)}
            className="flex-1 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 active:scale-[0.97] border border-red-500/40 hover:border-red-400/60 text-red-300 hover:text-red-200 font-black text-sm uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
            No
          </button>
        </div>

        <p className="text-[10px] font-mono text-[#C2CDC3]/50 text-center">
          Answer truthfully based on your secret character above
        </p>
      </div>
    </div>
  </div>
);
