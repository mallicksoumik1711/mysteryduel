interface GameHeaderProps {
  roomId: string;
  onLeaveRoom?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  roomId,
  onLeaveRoom,
}) => (
  <header className="shrink-0 z-20 w-full border-b border-[#2E3830] backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#93DD35] shadow-[0_0_12px_rgba(147,221,53,0.8)] animate-pulse shrink-0" />
        <h1 className="londrina-solid-black text-sm xs:text-base sm:text-xl font-black tracking-[0.14em] sm:tracking-[0.3em] uppercase text-[#FFFFFF] truncate">
          Mysteryduel <span className="londrina-solid-regular text-[#93DD35] font-mono text-[11px] sm:text-sm ml-0.5 sm:ml-1">// ARENA</span>
        </h1>
      </div>
      <div className="h-4 w-px bg-[#2E3830] hidden sm:block" />
      <div className="flex items-center gap-1 sm:gap-2 bg-[#202621] px-2 sm:px-2.5 py-0.5 border border-[#2E3830] shrink-0">
        <span className="text-[9px] sm:text-[10px] font-mono text-[#C2CDC3] uppercase tracking-wider hidden xs:inline">ROOM:</span>
        <span className="text-[11px] sm:text-xs font-mono font-bold text-[#93DD35]">{roomId}</span>
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      {onLeaveRoom && (
        <button
          id="leave-game-btn"
          onClick={onLeaveRoom}
          className="px-2.5 sm:px-3 py-1 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-[10px] sm:text-[11px] font-semibold text-red-300 hover:text-white transition-all shadow-md cursor-pointer active:scale-95 whitespace-nowrap"
        >
          Leave Game
        </button>
      )}
    </div>
  </header>
);
