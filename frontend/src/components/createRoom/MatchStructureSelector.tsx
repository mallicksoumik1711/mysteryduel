import React from 'react';

interface MatchStructureSelectorProps {
  selectedRounds: number;
  onSelectRounds: (rounds: number) => void;
  options?: number[];
}

export const MatchStructureSelector: React.FC<MatchStructureSelectorProps> = ({
  selectedRounds,
  onSelectRounds,
  options = [1, 3, 5],
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-bold text-[#C2CDC3] font-mono uppercase tracking-wider">
          2. Match Structure
        </label>
        <span className="text-[10px] font-mono text-[#C2CDC3]/70">BEST OF FORMAT</span>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-[#171C18]/80 p-1.5 rounded-xl border border-[#2E3830]">
        {options.map((num) => {
          const isActive = selectedRounds === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onSelectRounds(num)}
              className={`py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                isActive
                  ? 'bg-[#93DD35] text-[#171C18] shadow-md shadow-[#93DD35]/20 scale-[1.02]'
                  : 'text-[#C2CDC3] hover:text-[#FFFFFF] hover:bg-[#2E3830]/50'
              }`}
            >
              <span>{num} {num === 1 ? 'Round' : 'Rounds'}</span>
              <span className={`text-[9px] font-mono ${isActive ? 'text-[#171C18] font-black' : 'text-[#C2CDC3]/70'}`}>
                {num === 1 ? 'QUICK DUEL' : `FIRST TO ${Math.ceil(num / 2)}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
