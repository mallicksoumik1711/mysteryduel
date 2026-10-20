/**
 * AnswerPrompt
 * ============
 * A modal-style overlay that appears when the opponent has asked you a question.
 * Blocks interaction with the board until you answer Yes or No.
 */

import React from 'react';

interface AnswerPromptProps {
  questionText: string;
  onAnswer: (answer: boolean) => void;
}

export const AnswerPrompt: React.FC<AnswerPromptProps> = ({ questionText, onAnswer }) => (
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

    <div className="relative w-full max-w-md mx-4 rounded-2xl border border-[#93DD35]/40 bg-gradient-to-b from-[#1a2119] to-[#111612] shadow-2xl shadow-[#93DD35]/10 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#93DD35] to-transparent" />

      <div className="p-6 flex flex-col items-center gap-5">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-[#93DD35]/10 border border-[#93DD35]/30 flex items-center justify-center shadow-[0_0_20px_rgba(147,221,53,0.2)]">
          <svg className="w-6 h-6 text-[#93DD35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Label */}
        <div className="text-center space-y-1">
          <span className="block text-[10px] font-mono font-bold text-[#93DD35] uppercase tracking-[0.2em]">
            Opponent's Question
          </span>
          <p className="text-base font-bold text-[#FFFFFF] leading-snug text-center px-2">
            {questionText}
          </p>
        </div>

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
          Answer truthfully based on your secret character
        </p>
      </div>
    </div>
  </div>
);
