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
    navigate('/pick-character', { state: { roomCode, from: 'create-room' } });
  };

  return (
    // Background: Rangoon Green (#171C18)
    <div className="relative h-screen w-full bg-[#171C18] text-[#FFFFFF] font-sans flex items-center justify-center p-4 overflow-hidden select-none antialiased">

      {/* Main Container Card */}
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
                {/* Accent: Hummingbird Green (#93DD35) */}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleCreate} className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          
          {/* Deck Selection Cards */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-[#C2CDC3] font-mono uppercase tracking-wider">
                1. Select Character Deck
              </label>
              <span className="text-[10px] font-mono text-[#C2CDC3]/70">3 DECKS AVAILABLE</span>
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
                        ? 'bg-gradient-to-r from-[#93DD35]/15 via-[#202621] to-[#202621] border-[#93DD35]/60 shadow-lg shadow-black/40'
                        : 'bg-[#171C18]/60 border-[#2E3830] hover:border-[#93DD35]/40 hover:bg-[#202621]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#93DD35] text-[#171C18] shadow-md shadow-[#93DD35]/20 font-bold'
                            : 'bg-[#2E3830]/50 text-[#C2CDC3] group-hover:text-[#93DD35]'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-xs font-bold ${isSelected ? 'text-[#FFFFFF]' : 'text-[#C2CDC3]'}`}>
                            {item.title}
                          </p>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              isSelected
                                ? 'bg-[#93DD35]/20 text-[#93DD35] border border-[#93DD35]/40'
                                : 'bg-[#2E3830]/40 text-[#C2CDC3]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#C2CDC3]/80 mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-[#93DD35] bg-[#93DD35]' : 'border-[#2E3830] bg-transparent'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#171C18]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Match Length / Rounds Segment Control */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-[#C2CDC3] font-mono uppercase tracking-wider">
                2. Match Structure
              </label>
              <span className="text-[10px] font-mono text-[#C2CDC3]/70">BEST OF FORMAT</span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#171C18]/80 p-1.5 rounded-xl border border-[#2E3830]">
              {[1, 3, 5].map((num) => {
                const isActive = rounds === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRounds(num)}
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

          {/* Privacy Toggle Section */}
          <div className="p-3.5 bg-[#171C18]/60 border border-[#2E3830] rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-[#FFFFFF]">Room Privacy</p>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    isPrivate
                      ? 'bg-[#93DD35]/15 text-[#93DD35] border-[#93DD35]/40'
                      : 'bg-[#C2CDC3]/15 text-[#C2CDC3] border-[#C2CDC3]/40'
                  }`}
                >
                  {isPrivate ? 'INVITE ONLY' : 'PUBLIC LOBBY'}
                </span>
              </div>
              <p className="text-[11px] text-[#C2CDC3]">
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
                  ? 'bg-[#93DD35]/20 border-[#93DD35]/60'
                  : 'bg-[#2E3830] border-[#2E3830]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-200 flex items-center justify-center shadow-md ${
                  isPrivate
                    ? 'translate-x-5 bg-[#93DD35] text-[#171C18]'
                    : 'translate-x-0 bg-[#C2CDC3] text-[#171C18]'
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
            className="w-full py-3.5 rounded-xl bg-[#93DD35] hover:bg-[#85c82e] text-[#171C18] font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#93DD35]/25 active:scale-98 flex items-center justify-center gap-2 group"
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