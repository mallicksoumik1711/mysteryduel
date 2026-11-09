import React from 'react';

interface PageHeaderProps {
  onBack: () => void;
  roomCode: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  onBack,
  roomCode,
}) => {
  return (
    <div
      className="
        shrink-0
        w-full
        flex flex-wrap sm:flex-nowrap
        items-center justify-between
        gap-2 sm:gap-3
        backdrop-blur-sm
        border border-[#2E3830]
        px-2.5 py-2.5
        sm:px-4 sm:py-3
        shadow-lg
      "
    >
      <button
        onClick={onBack}
        className="
          shrink-0
          text-[10px] sm:text-xs
          font-mono text-[#C2CDC3]
          hover:text-white
          transition-all
          flex items-center gap-1.5 sm:gap-2
          cursor-pointer
          bg-[#2E3830]/60 hover:bg-[#2E3830]
          px-2.5 sm:px-3.5
          py-2 sm:py-1.5
          border border-[#2E3830]
        "
      >
        <span>←</span>
        <span>BACK</span>
      </button>

      <h1
        className="
          londrina-solid-regular
          text-xl sm:text-2xl
          md:text-3xl
          font-black
          text-[#93DD35]
          tracking-wider sm:tracking-widest
          uppercase
          text-center
          flex-1
          min-w-0
          leading-tight
        "
      >
        Pick a character
      </h1>

      <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 bg-[#171C18]/80 px-3 py-1 border border-[#2E3830] font-mono text-xs">
          <span className="text-[#C2CDC3]/60 uppercase text-[10px]">
            ROOM
          </span>

          <span className="text-[#93DD35] font-bold tracking-wider">
            {roomCode}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#93DD35]/10 border border-[#93DD35]/30 px-2 sm:px-3 py-1.5 sm:py-1">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#93DD35] animate-pulse shadow-[0_0_8px_rgba(147,221,53,0.8)]" />

          <span className="text-[9px] sm:text-[11px] font-mono font-bold text-[#93DD35] uppercase tracking-wide sm:tracking-wider whitespace-nowrap">
            STEP 2 / 2
          </span>
        </div>
      </div>

      {/* Room code on small screens */}
      <div className="sm:hidden w-full flex items-center justify-center gap-2 bg-[#171C18]/80 px-3 py-1.5 border border-[#2E3830] font-mono text-[10px]">
        <span className="text-[#C2CDC3]/60 uppercase">ROOM</span>

        <span className="text-[#93DD35] font-bold tracking-wider">
          {roomCode}
        </span>
      </div>
    </div>
  );
};

export default PageHeader;
