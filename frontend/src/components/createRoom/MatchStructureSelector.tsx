import React from 'react';

interface MatchStructureSelectorProps {
  selectedRounds: number;
  onSelectRounds: (rounds: number) => void;
  options?: number[];
}

export const MatchStructureSelector: React.FC<
  MatchStructureSelectorProps
> = ({
  selectedRounds,
  onSelectRounds,
  options = [1, 3, 5],
}) => {
  return (
    <div className="w-full min-w-0">
      {/* Section Header */}
      <div className="
        flex items-center justify-between
        gap-2 mb-2.5
      ">
        <label className="
          text-xs font-bold
          text-[#C2CDC3]
          font-mono uppercase tracking-wider
        ">
          2. Match Structure
        </label>

        <span className="
          text-[9px] sm:text-[10px]
          font-mono
          text-[#C2CDC3]/70
          whitespace-nowrap
        ">
          BEST OF FORMAT
        </span>
      </div>

      {/* Round Options */}
      <div className="
        grid grid-cols-3
        gap-1.5 sm:gap-2
        bg-[#171C18]/80
        p-1.5
        border border-[#2E3830]
      ">
        {options.map((num) => {
          const isActive = selectedRounds === num;

          return (
            <button
              key={num}
              type="button"
              onClick={() => onSelectRounds(num)}
              aria-pressed={isActive}
              className={`
                min-w-0 min-h-[58px]
                py-2.5 px-1
                text-xs font-bold
                transition-all cursor-pointer
                flex flex-col
                items-center justify-center
                gap-0.5
                ${
                  isActive
                    ? 'bg-[#93DD35] text-[#171C18] shadow-md shadow-[#93DD35]/20 scale-[1.02]'
                    : 'text-[#C2CDC3] hover:text-[#FFFFFF] hover:bg-[#2E3830]/50'
                }
              `}
            >
              <span className="
                text-[11px] sm:text-xs
                whitespace-nowrap
              ">
                {num} {num === 1 ? 'Round' : 'Rounds'}
              </span>

              <span
                className={`
                  text-[8px] sm:text-[9px]
                  font-mono
                  text-center
                  ${
                    isActive
                      ? 'text-[#171C18] font-black'
                      : 'text-[#C2CDC3]/70'
                  }
                `}
              >
                {num === 1
                  ? 'QUICK DUEL'
                  : `FIRST TO ${Math.ceil(num / 2)}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};