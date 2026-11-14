import React from 'react';

interface MobileBottomNavProps {
  activeDrawer: 'intel' | 'interrogation' | null;
  onOpenDrawer: (drawer: 'intel' | 'interrogation') => void;
  logsCount: number;
  isYourTurn: boolean;
  gameStarted: boolean;
  isEliminating?: boolean;
  isOpponentEliminating?: boolean;
  waitingForAnswer?: boolean;
  lastAnswer?: { answer: boolean } | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeDrawer,
  onOpenDrawer,
  logsCount,
  isYourTurn,
  gameStarted,
  isEliminating,
  isOpponentEliminating,
  waitingForAnswer,
  lastAnswer,
}) => {
  return (
    <nav className="lg:hidden shrink-0 z-30 w-full bg-[#111612]/95 border-t border-[#2E3830] backdrop-blur-md px-3 py-2 flex items-center justify-between gap-3">
      {/* Left Hamburger Button: Match Intel */}
      <button
        type="button"
        onClick={() => onOpenDrawer('intel')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 border text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer ${
          isEliminating
            ? 'bg-[#93DD35]/15 border-[#93DD35] text-[#93DD35]'
            : isOpponentEliminating || waitingForAnswer
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-[#171C18] hover:bg-[#202621] border-[#2E3830] text-[#C2CDC3]'
        }`}
        aria-label="Open Match Intel panel"
        aria-expanded={activeDrawer === 'intel'}
      >
        {/* Hamburger icon */}
        <div className="flex flex-col justify-center gap-[3px] w-4 h-3.5 shrink-0">
          <span className="w-full h-[2px] bg-[#93DD35] rounded-full" />
          <span className="w-3/4 h-[2px] bg-[#93DD35] rounded-full" />
          <span className="w-full h-[2px] bg-[#93DD35] rounded-full" />
        </div>
        <span className="truncate">Match Intel</span>

        {isEliminating ? (
          <span className="text-[9px] bg-[#93DD35] text-[#111612] px-1.5 py-0.5 font-black tracking-wider shrink-0">
            {lastAnswer?.answer ? 'YES' : 'NO'}
          </span>
        ) : isOpponentEliminating ? (
          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 font-bold tracking-wider shrink-0">
            WAIT
          </span>
        ) : logsCount > 0 ? (
          <span className="text-[9px] bg-[#202621] text-[#93DD35] px-1.5 py-0.5 border border-[#2E3830] font-mono font-bold">
            {logsCount}
          </span>
        ) : null}
      </button>

      {/* Right Hamburger Button: Interrogation Panel */}
      <button
        type="button"
        onClick={() => onOpenDrawer('interrogation')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 border text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer ${
          isYourTurn && gameStarted && !isEliminating && !isOpponentEliminating && !waitingForAnswer
            ? 'bg-[#93DD35]/15 border-[#93DD35] text-[#93DD35]'
            : 'bg-[#171C18] hover:bg-[#202621] border-[#2E3830] text-[#C2CDC3]'
        }`}
        aria-label="Open Interrogation panel"
        aria-expanded={activeDrawer === 'interrogation'}
      >
        {/* Hamburger icon */}
        <div className="flex flex-col justify-center items-end gap-[3px] w-4 h-3.5 shrink-0">
          <span
            className={`w-full h-[2px] rounded-full ${
              isYourTurn && gameStarted ? 'bg-[#93DD35]' : 'bg-[#C2CDC3]'
            }`}
          />
          <span
            className={`w-3/4 h-[2px] rounded-full ${
              isYourTurn && gameStarted ? 'bg-[#93DD35]' : 'bg-[#C2CDC3]'
            }`}
          />
          <span
            className={`w-full h-[2px] rounded-full ${
              isYourTurn && gameStarted ? 'bg-[#93DD35]' : 'bg-[#C2CDC3]'
            }`}
          />
        </div>
        <span className="truncate">Interrogation</span>

        {isYourTurn && gameStarted && !isEliminating && !isOpponentEliminating && !waitingForAnswer && (
          <span className="text-[9px] bg-[#93DD35] text-[#111612] px-1.5 py-0.5 font-black tracking-wider shrink-0">
            YOUR TURN
          </span>
        )}
      </button>
    </nav>
  );
};

export default MobileBottomNav;

