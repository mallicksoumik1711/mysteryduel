import React from 'react';

export interface Question {
  id: string;
  text: string;
  attribute_key: string;
}

interface InterrogationPanelProps {
  isYourTurn: boolean;
  questions: Question[];
  loadingQuestions: boolean;
  questionsError: string | null;
  selectedQuestion: string | null;
  onSelectQuestion: (id: string) => void;
  onAskQuestion: (text: string) => void;
  /** True when we've submitted a question and are waiting for opponent's answer */
  waitingForAnswer?: boolean;
  /** True when opponent is currently eliminating characters */
  isOpponentEliminating?: boolean;
  /** True when current user is currently eliminating characters */
  isEliminating?: boolean;
  /** Callback to notify that current user finished elimination */
  onDoneEliminating?: () => void;
}

export const InterrogationPanel: React.FC<InterrogationPanelProps> = ({
  isYourTurn,
  questions,
  loadingQuestions,
  questionsError,
  selectedQuestion,
  onSelectQuestion,
  onAskQuestion,
  waitingForAnswer = false,
  isOpponentEliminating = false,
  isEliminating = false,
  onDoneEliminating,
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
          isOpponentEliminating
            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse'
            : isEliminating
            ? 'bg-[#93DD35]/15 text-[#93DD35] border-[#93DD35]/40 shadow-[0_0_10px_rgba(147,221,53,0.2)]'
            : isYourTurn
            ? 'bg-[#93DD35]/10 text-[#93DD35] border-[#93DD35]/30'
            : 'bg-[#171C18] text-[#C2CDC3]/50 border-[#2E3830]'
        }`}
      >
        {isOpponentEliminating
          ? 'OPPONENT ELIMINATING'
          : isEliminating
          ? 'ELIMINATION PHASE'
          : isYourTurn
          ? 'YOUR TURN'
          : 'WAITING'}
      </span>
    </div>

    <div className="p-3 flex-1 min-h-0 flex flex-col gap-2">
      {/* Dynamic status helper */}
      {isOpponentEliminating ? (
        <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Questions Locked
          </div>
          <p className="text-[11px] text-[#C2CDC3] leading-snug">
            Opponent is eliminating characters on their board. Watching their board updates live.
          </p>
        </div>
      ) : isEliminating ? (
        <div className="p-2.5 rounded-lg border border-[#93DD35]/40 bg-[#93DD35]/10 flex flex-col gap-2 shadow-[0_0_15px_rgba(147,221,53,0.1)]">
          <div className="flex items-center gap-1.5 text-[#93DD35] font-mono text-[10px] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#93DD35] animate-ping" />
            Eliminate Characters
          </div>
          <p className="text-[11px] text-[#FFFFFF] leading-snug">
            Click characters on your Tactical Board to eliminate them, then notify opponent when done.
          </p>
          {onDoneEliminating && (
            <button
              onClick={onDoneEliminating}
              className="w-full py-2 rounded-lg bg-[#93DD35] hover:bg-[#85c82e] active:scale-[0.98] text-[#171C18] font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Done Eliminating
            </button>
          )}
        </div>
      ) : (
        <p className="shrink-0 text-[11px] text-[#C2CDC3] font-medium leading-tight">
          {waitingForAnswer
            ? 'Waiting for opponent to answer...'
            : isYourTurn
            ? 'Select a question to submit:'
            : 'Waiting for opponent to ask...'}
        </p>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-2">
        {loadingQuestions ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-t-[#93DD35] border-b-[#2E3830] border-r-[#2E3830] rounded-full animate-spin" />
            <span className="ml-2 text-[#93DD35] text-xs font-semibold uppercase tracking-wider">Loading questions...</span>
          </div>
        ) : questionsError ? (
          <div className="flex items-center justify-center h-full text-red-500 text-sm font-semibold">
            {questionsError}
          </div>
        ) : (
          questions.map((q) => {
            const isSelected = selectedQuestion === q.id;
            const canAsk = isYourTurn && !isEliminating && !isOpponentEliminating && !waitingForAnswer;
            return (
              <div
                key={q.id}
                onClick={() => canAsk && onSelectQuestion(q.id)}
                className={`group relative p-2.5 rounded-lg border transition-all duration-150 ${
                  !canAsk
                    ? 'opacity-40 cursor-not-allowed border-[#2E3830] bg-[#171C18]/40'
                    : isSelected
                    ? 'bg-gradient-to-r from-[#93DD35]/20 to-[#171C18] border-[#93DD35]/60 shadow-md text-[#FFFFFF]'
                    : 'bg-[#171C18]/80 border-[#2E3830] text-[#C2CDC3] hover:border-[#93DD35]/40 hover:bg-[#171C18] cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] font-mono text-[#93DD35] font-semibold uppercase tracking-wider">
                    {q.attribute_key.split(':')[0].replace('_', ' ')}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#93DD35] animate-ping" />
                  )}
                </div>
                <p className="text-[11px] font-medium leading-snug">{q.text}</p>

                {isSelected && canAsk && (
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
          })
        )}
      </div>
    </div>
  </section>
);