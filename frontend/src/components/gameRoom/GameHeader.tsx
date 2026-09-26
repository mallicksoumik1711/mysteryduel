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
  <header className="shrink-0 z-20 w-full border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
        <h1 className="text-xs font-black tracking-[0.2em] uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Mysteryduel <span className="text-amber-500 font-mono text-[11px] ml-1">// ARENA</span>
        </h1>
      </div>
      <div className="h-4 w-px bg-white/10 hidden sm:block" />
      <div className="hidden sm:flex items-center gap-2 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/10">
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">ROOM:</span>
        <span className="text-xs font-mono font-bold text-amber-400">{roomId}</span>
      </div>
    </div>

    <div className="flex items-center gap-2.5">
      <button
        onClick={onToggleTurn}
        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
        title="Toggle Turn for debugging"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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
