import React from 'react';

interface TurnIndicatorProps {
  isYourTurn: boolean;
  playerName: string;
  opponentName: string;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ 
  isYourTurn, 
  opponentName 
}) => {
  return (
    <div className="flex items-center justify-center p-2">
      <div 
        className={`
          px-6 py-2.5 rounded-full font-bold text-xs tracking-wider transition-all duration-300 flex items-center gap-2.5
          ${isYourTurn 
            ? 'bg-zinc-100 text-zinc-950 shadow-[0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-white/80' 
            : 'bg-white/5 border border-white/10 text-zinc-400 backdrop-blur-md'
          }
        `}
      >
        <span className={`w-2 h-2 rounded-full ${isYourTurn ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
        {isYourTurn ? 'YOUR TURN' : `WAITING FOR ${opponentName.toUpperCase()}...`}
      </div>
    </div>
  );
};


