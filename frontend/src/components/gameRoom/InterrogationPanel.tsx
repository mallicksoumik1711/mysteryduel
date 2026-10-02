import React from 'react';
import type { Question } from './gameRoom.types';

interface InterrogationPanelProps {
  isYourTurn: boolean;
  questions: Question[];
  selectedQuestion: string | null;
  onSelectQuestion: (id: string) => void;
  onAskQuestion: (text: string) => void;
}

export const InterrogationPanel: React.FC<InterrogationPanelProps> = ({
  isYourTurn,
  questions,
  selectedQuestion,
  onSelectQuestion,
  onAskQuestion,
}) => (
  <section className="lg:col-span-3 flex flex-col h-full min-h-0 border border-[#2E3830] rounded-xl backdrop-blur-sm overflow-hidden">
    {/* Header */}
    <div className="shrink-0 px-3.5 py-2.5 border-b border-[#2E3830] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-3.5 bg-[#93DD35] rounded-full shadow-[0_0_8px_rgba(147,221,53,0.5)]" />
        <h2 className="text-[11px] font-bold text-[#FFFFFF] uppercase tracking-widest font-mono">
          Interrogation
        </h2>
      </div>
      <span
        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
          isYourTurn
            ? 'bg-[#93DD35]/10 text-[#93DD35] border-[#93DD35]/30'
            : 'bg-[#171C18] text-[#C2CDC3]/50 border-[#2E3830]'
        }`}
      >
        {isYourTurn ? 'YOUR TURN' : 'WAITING'}
      </span>
    </div>

    <div className="p-3 flex-1 min-h-0 flex flex-col gap-2">
      <p className="shrink-0 text-[11px] text-[#C2CDC3] font-medium leading-tight">
        {isYourTurn ? 'Select a question to submit:' : 'Waiting for opponent response...'}
      </p>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-2">
        {questions.map((q) => {
          const isSelected = selectedQuestion === q.id;
          return (
            <div
              key={q.id}
              onClick={() => isYourTurn && onSelectQuestion(q.id)}
              className={`group relative p-2.5 rounded-lg border transition-all duration-150 ${
                !isYourTurn
                  ? 'opacity-40 cursor-not-allowed border-[#2E3830] bg-[#171C18]/40'
                  : isSelected
                  ? 'bg-gradient-to-r from-[#93DD35]/20 to-[#171C18] border-[#93DD35]/60 shadow-md text-[#FFFFFF]'
                  : 'bg-[#171C18]/80 border-[#2E3830] text-[#C2CDC3] hover:border-[#93DD35]/40 hover:bg-[#171C18] cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-mono text-[#93DD35] font-semibold uppercase tracking-wider">
                  {q.category}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#93DD35] animate-ping" />
                )}
              </div>
              <p className="text-[11px] font-medium leading-snug">{q.text}</p>

              {isSelected && isYourTurn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAskQuestion(q.text);
                  }}
                  className="w-full mt-2 py-1.5 rounded bg-[#93DD35] hover:bg-[#85c82e] text-[#171C18] font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-98 flex items-center justify-center gap-1"
                >
                  <span>Submit Question</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </section>
);