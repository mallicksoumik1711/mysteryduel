import React from 'react';

interface CreateRoomHeaderProps {
  onBack: () => void;
}

export const CreateRoomHeader: React.FC<CreateRoomHeaderProps> = ({ onBack }) => {
  return (
    <div className="p-5 sm:p-6 pb-4 border-b border-[#2E3830] bg-[#171C18]/60 flex flex-col gap-3">
      <button
        onClick={onBack}
        type="button"
        className="self-start text-xs font-mono text-[#C2CDC3] hover:text-[#FFFFFF] transition-all flex items-center gap-2 cursor-pointer group bg-[#2E3830]/50 hover:bg-[#2E3830] px-3 py-1.5 rounded-lg border border-[#2E3830]"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>BACK TO LOBBY</span>
      </button>

      <div className="flex items-center justify-between mt-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#93DD35] animate-pulse shadow-[0_0_10px_rgba(147,221,53,0.7)]" />
            <span className="text-[10px] font-mono font-bold text-[#93DD35] uppercase tracking-widest">
              MATCH SETUP
            </span>
          </div>
          <h1 className="text-xl font-black text-[#FFFFFF] tracking-wide uppercase">Create Duel Room</h1>
        </div>
        <span className="text-xs font-mono text-[#C2CDC3] bg-[#171C18] px-2.5 py-1 rounded border border-[#2E3830]">
          CUSTOM LOBBY
        </span>
      </div>
    </div>
  );
};
