import React from 'react';

interface PageHeaderProps {
  onBack: () => void;
  roomCode: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onBack, roomCode }) => {
  return (
    <div className="flex items-center justify-between shrink-0 backdrop-blur-sm border border-[#2E3830] px-4 py-3 shadow-lg">
      <button
        onClick={onBack}
        className="text-xs font-mono text-[#C2CDC3] hover:text-[#FFFFFF] transition-all flex items-center gap-2 cursor-pointer bg-[#2E3830]/60 hover:bg-[#2E3830] px-3.5 py-1.5 border border-[#2E3830]"
      >
        <span>←</span>
        <span>BACK</span>
      </button>

      <h1 className="londrina-solid-regular text-2xl font-black text-[#93DD35] tracking-widest uppercase">
        Pick a character
      </h1>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-[#171C18]/80 px-3 py-1 border border-[#2E3830] font-mono text-xs">
          <span className="text-[#C2CDC3]/60 uppercase text-[10px]">ROOM</span>
          <span className="text-[#93DD35] font-bold tracking-wider">{roomCode}</span>
        </div>

        <div className="flex items-center gap-2 bg-[#93DD35]/10 border border-[#93DD35]/30 px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-[#93DD35] animate-pulse shadow-[0_0_8px_rgba(147,221,53,0.8)]" />
          <span className="text-[11px] font-mono font-bold text-[#93DD35] uppercase tracking-wider">
            STEP 2 / 2
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

