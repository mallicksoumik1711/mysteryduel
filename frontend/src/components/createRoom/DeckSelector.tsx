import React from 'react';

export interface DeckItem {
  id: string;
  title: string;
  desc: string;
  badge: string;
  icon: React.ReactNode;
}

export const DECKS: DeckItem[] = [
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

interface DeckSelectorProps {
  selectedDeck: string;
  onSelectDeck: (deckId: string) => void;
}

export const DeckSelector: React.FC<DeckSelectorProps> = ({ selectedDeck, onSelectDeck }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-bold text-[#C2CDC3] font-mono uppercase tracking-wider">
          1. Select Character Deck
        </label>
        <span className="text-[10px] font-mono text-[#C2CDC3]/70">3 DECKS AVAILABLE</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {DECKS.map((item) => {
          const isSelected = selectedDeck === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectDeck(item.id)}
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
  );
};
