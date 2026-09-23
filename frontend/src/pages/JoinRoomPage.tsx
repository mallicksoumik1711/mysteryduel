import React, { useState } from 'react';

interface JoinRoomPageProps {
  onBack: () => void;
  onJoinAndStart: (roomCode: string) => void;
}

export const JoinRoomPage: React.FC<JoinRoomPageProps> = ({ onBack, onJoinAndStart }) => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    onJoinAndStart(roomCode.toUpperCase().trim());
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0f0608] text-zinc-100 font-sans flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Background Glows */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #2b1018 0%, #0a0306 100%)' }}
      />

      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <button
          onClick={onBack}
          className="text-xs text-zinc-400 hover:text-white transition-colors mb-6 flex items-center gap-1.5 cursor-pointer"
        >
          ← Back to home
        </button>

        <h1 className="text-xl font-semibold text-white mb-1">Join Game Room</h1>
        <p className="text-xs text-zinc-400 mb-6">Enter your details and room code to join an ongoing match.</p>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Player Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Detective Holmes"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Room Code</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. X8K2M1"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2.5 text-sm font-mono tracking-widest text-center text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 transition-colors uppercase"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-full bg-zinc-100 text-zinc-950 font-semibold text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 cursor-pointer"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomPage;