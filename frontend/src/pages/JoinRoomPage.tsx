import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    navigate('/pick-character', {
      state: { roomCode: roomCode.toUpperCase().trim(), from: 'join-room' },
    });
  };

  const isCodeComplete = roomCode.trim().length === 6;
  const isReadyToJoin = playerName.trim().length > 0 && isCodeComplete;

  return (
    <div className="relative h-screen w-full bg-[#090406] text-zinc-100 font-sans flex items-center justify-center p-4 overflow-hidden select-none antialiased">
      {/* Micro Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Ambient Radial Mesh Lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-rose-950/20 blur-[150px] rounded-full z-0" />
      <div className="pointer-events-none absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-amber-900/15 blur-[140px] rounded-full z-0" />

      {/* Main Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-lg bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Section */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 bg-white/[0.02] flex flex-col gap-3">
          <button
            onClick={() => navigate('/')}
            type="button"
            className="self-start text-xs font-mono text-zinc-400 hover:text-white transition-all flex items-center gap-2 cursor-pointer group bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>BACK TO LOBBY</span>
          </button>

          <div className="flex items-center justify-between mt-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  MATCH DISCOVERY
                </span>
              </div>
              <h1 className="text-xl font-black text-white tracking-wide uppercase">Join Game Room</h1>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-black/40 px-2.5 py-1 rounded border border-white/5">
              DIRECT ACCESS
            </span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleJoin} className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          
          {/* Player Name / Handle Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">
                1. Player Handle
              </label>
              <span className="text-[10px] font-mono text-zinc-500">DISPLAY NAME</span>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-zinc-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Detective Holmes"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 focus:border-amber-400/60 focus:bg-black/60 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Tactical Room Code Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">
                2. Enter Room Code
              </label>
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className={isCodeComplete ? 'text-amber-400 font-bold' : 'text-zinc-500'}>
                  {roomCode.trim().length}
                </span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-500">6 CHARS</span>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                maxLength={6}
                placeholder="X8K2M1"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className={`w-full bg-black/50 border rounded-xl py-3.5 px-4 text-center font-mono text-lg font-black tracking-[0.4em] uppercase transition-all shadow-inner placeholder:tracking-[0.3em] placeholder:text-zinc-700 focus:outline-none ${
                  isCodeComplete
                    ? 'border-emerald-400/60 bg-emerald-950/10 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.1)]'
                    : 'border-white/10 focus:border-amber-400/60 text-amber-400'
                }`}
              />

              {/* Status Badge inside Input */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {isCodeComplete ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    CODE
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ask the host for the 6-character access code</span>
            </p>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 bg-black/30 border border-white/10 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-zinc-300">Instant Match Connection</p>
              <p className="text-[11px] text-zinc-500">You will join directly into the host's active lobby</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </div>

          {/* Submit Action CTA */}
          <button
            type="submit"
            disabled={!roomCode.trim()}
            className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-lg ${
              isReadyToJoin
                ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-amber-500/20 active:scale-98'
                : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-white/10 active:scale-98'
            }`}
          >
            <span>JOIN ROOM & ENTER</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

      </div>
    </div>
  );
};

export default JoinRoomPage;
