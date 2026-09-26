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
  <section className="lg:col-span-3 flex flex-col h-full min-h-0 bg-zinc-900/40 border border-white/10 rounded-xl backdrop-blur-2xl shadow-xl overflow-hidden">
    {/* Header */}
    <div className="shrink-0 px-3.5 py-2.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
        <h2 className="text-[11px] font-bold text-white uppercase tracking-widest font-mono">
          Interrogation
        </h2>
      </div>
      <span
        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
          isYourTurn
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-zinc-800 text-zinc-500 border-white/5'
        }`}
      >
        {isYourTurn ? 'YOUR TURN' : 'WAITING'}
      </span>
    </div>

    <div className="p-3 flex-1 min-h-0 flex flex-col gap-2">
      <p className="shrink-0 text-[11px] text-zinc-400 font-medium leading-tight">
        {isYourTurn ? 'Select a question to submit:' : 'Waiting for opponent response...'}
      </p>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
        {questions.map((q) => {
          const isSelected = selectedQuestion === q.id;
          return (
            <div
              key={q.id}
              onClick={() => isYourTurn && onSelectQuestion(q.id)}
              className={`group relative p-2.5 rounded-lg border transition-all duration-150 ${
                !isYourTurn
                  ? 'opacity-40 cursor-not-allowed border-white/5 bg-black/20'
                  : isSelected
                  ? 'bg-gradient-to-r from-amber-500/20 to-zinc-900 border-amber-500/50 shadow-md text-white'
                  : 'bg-black/30 border-white/10 text-zinc-300 hover:border-white/25 hover:bg-black/50 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-mono text-amber-400/90 font-semibold uppercase tracking-wider">
                  {q.category}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <p className="text-[11px] font-medium leading-snug">{q.text}</p>

              {isSelected && isYourTurn && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAskQuestion(q.text);
                  }}
                  className="w-full mt-2 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-98 flex items-center justify-center gap-1"
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
