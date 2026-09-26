import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DECKS = [
  {
    id: 'anime-heroes',
    title: 'Anime Heroes & Villains',
    desc: 'Iconic anime characters, protagonists & rivals',
    badge: 'POPULAR',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'classic-mystery',
    title: 'Classic Mystery Cast',
    desc: 'Detectives, suspects & classic noir archetypes',
    badge: 'CLASSIC',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'sci-fi',
    title: 'Sci-Fi Legends',
    desc: 'Cyberpunk hackers, aliens & space explorers',
    badge: 'SCI-FI',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [deck, setDeck] = useState('anime-heroes');
  const [isPrivate, setIsPrivate] = useState(true);
  const [rounds, setRounds] = useState(3);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Pass roomCode via location state so pick-character page can read it
    navigate('/pick-character', { state: { roomCode, from: 'create-room' } });
  };

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
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                  MATCH SETUP
                </span>
              </div>
              <h1 className="text-xl font-black text-white tracking-wide uppercase">Create Duel Room</h1>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-black/40 px-2.5 py-1 rounded border border-white/5">
              CUSTOM LOBBY
            </span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleCreate} className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          
          {/* Deck Selection Cards */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">
                1. Select Character Deck
              </label>
              <span className="text-[10px] font-mono text-zinc-500">3 DECKS AVAILABLE</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {DECKS.map((item) => {
                const isSelected = deck === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setDeck(item.id)}
                    className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border-amber-500/60 shadow-lg shadow-amber-950/20'
                        : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-black/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                            : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                            {item.title}
                          </p>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              isSelected
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : 'bg-white/5 text-zinc-500'
                            }`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-amber-400 bg-amber-400' : 'border-zinc-700 bg-transparent'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Match Length / Rounds Segment Control */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">
                2. Match Structure
              </label>
              <span className="text-[10px] font-mono text-zinc-500">BEST OF FORMAT</span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
              {[1, 3, 5].map((num) => {
                const isActive = rounds === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRounds(num)}
                    className={`py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isActive
                        ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20 scale-[1.02]'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{num} {num === 1 ? 'Round' : 'Rounds'}</span>
                    <span className={`text-[9px] font-mono ${isActive ? 'text-zinc-900/80 font-bold' : 'text-zinc-600'}`}>
                      {num === 1 ? 'QUICK DUEL' : `FIRST TO ${Math.ceil(num / 2)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy Toggle Section */}
          <div className="p-3.5 bg-black/30 border border-white/10 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-zinc-200">Room Privacy</p>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    isPrivate
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {isPrivate ? 'INVITE ONLY' : 'PUBLIC LOBBY'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {isPrivate
                  ? 'Players must enter code to join your room'
                  : 'Anyone can discover and join this match'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-12 h-7 rounded-full transition-all relative cursor-pointer border ${
                isPrivate
                  ? 'bg-amber-500/20 border-amber-500/40'
                  : 'bg-zinc-800 border-white/10'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-200 flex items-center justify-center shadow-md ${
                  isPrivate
                    ? 'translate-x-5 bg-amber-400 text-zinc-950'
                    : 'translate-x-0 bg-zinc-400 text-zinc-950'
                }`}
              >
                {isPrivate ? (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ) : (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                )}
              </span>
            </button>
          </div>

          {/* Submit Action CTA */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2 group"
          >
            <span>GENERATE ROOM & START</span>
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

export default CreateRoomPage;
