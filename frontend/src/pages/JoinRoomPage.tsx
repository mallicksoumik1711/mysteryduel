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
    // Background: Rangoon Green (#171C18)
    <div className="relative h-screen w-full bg-[#171C18] text-[#FFFFFF] font-sans flex items-center justify-center p-4 overflow-hidden  antialiased">

      {/* Main Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-lg bg-[#202621]/95 border border-[#2E3830] rounded-2xl backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Section */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#2E3830] bg-[#171C18]/60 flex flex-col gap-3">
          <button
            onClick={() => navigate('/')}
            type="button"
            className="self-start text-xs font-mono text-[#C2CDC3] hover:text-[#FFFFFF] transition-all flex items-center gap-2 cursor-pointer group bg-[#2E3830]/50 hover:bg-[#2E3830] px-3 py-1.5 rounded-lg border border-[#2E3830]"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>BACK TO LOBBY</span>
          </button>

          <div className="flex items-center justify-between mt-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {/* Accent Pulse: Hummingbird Green */}
                <span className="w-2 h-2 rounded-full bg-[#93DD35] animate-pulse shadow-[0_0_8px_rgba(147,221,53,0.8)]" />
                <span className="text-[10px] font-mono font-bold text-[#93DD35] uppercase tracking-widest">
                  MATCH DISCOVERY
                </span>
              </div>
              <h1 className="londrina-solid-regular text-2xl font-black text-[#FFFFFF] tracking-widest uppercase">Join Game Room</h1>
            </div>
            <span className="text-xs font-mono text-[#C2CDC3] bg-[#171C18] px-2.5 py-1 rounded border border-[#2E3830]">
              DIRECT ACCESS
            </span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleJoin} className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          
          {/* Player Name / Handle Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#C2CDC3] font-mono uppercase tracking-wider">
                1. Player Handle
              </label>
              <span className="text-[10px] font-mono text-[#C2CDC3]/70">DISPLAY NAME</span>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none text-[#C2CDC3]/60">
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
                className="w-full bg-[#171C18]/60 border border-[#2E3830] focus:border-[#93DD35]/60 focus:bg-[#171C18] rounded-xl pl-10 pr-4 py-3 text-xs text-[#FFFFFF] placeholder-[#C2CDC3]/40 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Tactical Room Code Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#C2CDC3] font-mono uppercase tracking-wider">
                2. Enter Room Code
              </label>
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className={isCodeComplete ? 'text-[#93DD35] font-bold' : 'text-[#C2CDC3]/70'}>
                  {roomCode.trim().length}
                </span>
                <span className="text-[#2E3830]">/</span>
                <span className="text-[#C2CDC3]/70">6 CHARS</span>
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
                className={`w-full bg-[#171C18]/80 border rounded-xl py-3.5 px-4 text-center font-mono text-lg font-black tracking-[0.4em] uppercase transition-all shadow-inner placeholder:tracking-[0.3em] placeholder:text-[#C2CDC3]/30 focus:outline-none ${
                  isCodeComplete
                    ? 'border-[#93DD35]/60 bg-[#93DD35]/10 text-[#93DD35] shadow-[0_0_15px_rgba(147,221,53,0.15)]'
                    : 'border-[#2E3830] focus:border-[#93DD35]/60 text-[#93DD35]'
                }`}
              />

              {/* Status Badge inside Input */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {isCodeComplete ? (
                  <span className="w-5 h-5 rounded-full bg-[#93DD35]/20 text-[#93DD35] border border-[#93DD35]/40 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#C2CDC3]/60 bg-[#2E3830]/50 px-2 py-0.5 rounded border border-[#2E3830]">
                    CODE
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-[#C2CDC3]/70 mt-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#C2CDC3]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ask the host for the 6-character access code</span>
            </p>
          </div>

          {/* Quick Info Box */}
          <div className="p-3.5 bg-[#171C18]/60 border border-[#2E3830] rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#FFFFFF]">Instant Match Connection</p>
              <p className="text-[11px] text-[#C2CDC3]/70">You will join directly into the host's active lobby</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#93DD35] shadow-[0_0_8px_rgba(147,221,53,0.8)]" />
          </div>

          {/* Submit Action CTA */}
          <button
            type="submit"
            disabled={!isReadyToJoin}
            className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 group shadow-lg ${
              isReadyToJoin
                ? 'bg-[#93DD35] hover:bg-[#85c82e] text-[#171C18] shadow-[#93DD35]/25 active:scale-98'
                : 'bg-[#2E3830] text-[#C2CDC3]/40 cursor-not-allowed shadow-none'
            }`}
          >
            <span>JOIN ROOM & ENTER</span>
            <svg
              className={`w-4 h-4 transition-transform ${isReadyToJoin ? 'group-hover:translate-x-1' : ''}`}
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