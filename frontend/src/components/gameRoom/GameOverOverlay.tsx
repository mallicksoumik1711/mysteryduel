import React, { useEffect, useState } from 'react';
import type { Character } from '../../types';

interface GameOverOverlayProps {
  /** The character that was guessed. */
  character: Character | null;
  /** Whether the local player won. */
  isWinner: boolean;
  /** Whether the guess was correct (same semantics as isWinner for the guesser, but also covers receiving player). */
  correct: boolean;
  /** Called when the user wants to leave the game room. */
  onLeave: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  character,
  isWinner,
  correct,
  onLeave,
}) => {
  const [visible, setVisible] = useState(false);

  // Delay entrance animation by one frame so the transition triggers.
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const accentColor = isWinner ? '#93DD35' : '#ef4444';
  const accentShadow = isWinner
    ? 'rgba(147,221,53,0.35)'
    : 'rgba(239,68,68,0.35)';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        background: 'rgba(10, 13, 11, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'opacity 0.4s ease',
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Ambient glow behind the card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isWinner
            ? 'radial-gradient(ellipse at 50% 40%, rgba(147,221,53,0.12) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm   overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #141A15 0%, #0D110E 100%)',
          border: `1px solid ${accentColor}40`,
          boxShadow: `0 0 80px ${accentShadow}, 0 8px 48px rgba(0,0,0,0.6)`,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />

        <div className="px-8 pt-8 pb-9 flex flex-col items-center gap-6 text-center">

          {/* Headline */}
          <div className="space-y-1">
            <p
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: accentColor }}
            >
              {isWinner ? 'Mystery Solved' : 'Game Over'}
            </p>
            <h2 className="text-3xl font-black text-white tracking-wider londrina-solid-regular">
              {isWinner ? 'You Win!' : 'You Lose!'}
            </h2>
            <p className="text-sm text-[#C2CDC3]/70 leading-relaxed">
              {isWinner
                ? 'Brilliant deduction, you cracked the case!'
                : correct
                  ? 'Your opponent cracked the case first.'
                  : 'Wrong guess — the mystery lives on.'}
            </p>
          </div>

          {/* Character portrait */}
          {character && (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-24 h-24 rounded-full overflow-hidden shrink-0"
                style={{
                  border: `3px solid ${accentColor}80`,
                  boxShadow: `0 0 24px ${accentShadow}`,
                }}
              >
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p
                  className="text-[9px] font-mono uppercase tracking-widest mb-0.5"
                  style={{ color: `${accentColor}90` }}
                >
                  {isWinner ? "Opponent's Character" : 'Guessed Character'}
                </p>
                <p className="text-lg font-black text-white">{character.name}</p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="w-full border-t border-[#2E3830]" />

          {/* CTA */}
          <button
            type="button"
            id="game-over-leave-btn"
            onClick={onLeave}
            className="w-full py-3.5 text-3xl londrina-solid-regular font-black uppercase tracking-wider transition-all active:scale-[0.97]"
            style={{
              background: accentColor,
              color: '#111612',
              boxShadow: `0 0 20px ${accentShadow}`,
            }}
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverOverlay;
