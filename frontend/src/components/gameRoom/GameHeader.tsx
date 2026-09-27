import React from 'react';

interface GameHeaderProps {
  roomId: string;
  onToggleTurn: () => void;
  onLeaveRoom?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  roomId,
  onToggleTurn,
  onLeaveRoom,
}) => (
  <header className="shrink-0 z-20 w-full border-b border-[#2E3830] bg-[#171C18]/80 backdrop-blur-xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#93DD35] shadow-[0_0_12px_rgba(147,221,53,0.8)] animate-pulse" />
        <h1 className="text-xs font-black tracking-[0.2em] uppercase text-[#FFFFFF]">
          Mysteryduel <span className="text-[#93DD35] font-mono text-[11px] ml-1">// ARENA</span>
        </h1>
      </div>
      <div className="h-4 w-px bg-[#2E3830] hidden sm:block" />
      <div className="hidden sm:flex items-center gap-2 bg-[#202621] px-2.5 py-0.5 rounded-md border border-[#2E3830]">
        <span className="text-[10px] font-mono text-[#C2CDC3] uppercase tracking-wider">ROOM:</span>
        <span className="text-xs font-mono font-bold text-[#93DD35]">{roomId}</span>
      </div>
    </div>

    <div className="flex items-center gap-2.5">
      <button
        onClick={onToggleTurn}
        className="px-2.5 py-1 rounded-lg bg-[#202621] hover:bg-[#2E3830] border border-[#2E3830] text-[10px] font-mono text-[#C2CDC3] hover:text-[#FFFFFF] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
        title="Toggle Turn for debugging"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#93DD35]" />
        Debug Turn
      </button>

      {onLeaveRoom && (
        <button
          onClick={onLeaveRoom}
          className="px-3 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-[11px] font-semibold text-red-300 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
        >
          Leave Game
        </button>
      )}
    </div>
  </header>
);