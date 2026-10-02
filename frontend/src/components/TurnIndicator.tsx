import React from 'react';

interface TurnIndicatorProps {
  isYourTurn: boolean;
  opponentName: string;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ isYourTurn, opponentName }) => {
  return (
    <div className="flex items-center justify-center p-2">
      <div 
        className={`
          px-6 py-2.5 rounded-full font-black text-xs tracking-wider transition-all duration-300 flex items-center gap-2.5 uppercase
          ${isYourTurn 
            ? 'bg-[#93DD35] text-[#171C18] shadow-[0_0_25px_rgba(147,221,53,0.3)] ring-1 ring-[#93DD35]' 
            : 'bg-[#202621] border border-[#2E3830] text-[#C2CDC3] backdrop-blur-md'
          }
        `}
      >
        <span className={`w-2 h-2 rounded-full ${isYourTurn ? 'bg-[#171C18] animate-pulse' : 'bg-[#C2CDC3]/50'}`} />
        {isYourTurn ? 'YOUR TURN' : `WAITING FOR ${opponentName.toUpperCase()}...`}
      </div>
    </div>
  );
};