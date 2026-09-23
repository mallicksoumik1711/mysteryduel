import React, { useState } from 'react';

interface CreateRoomPageProps {
  onBack: () => void;
  onCreateAndStart: (roomCode: string) => void;
}

export const CreateRoomPage: React.FC<CreateRoomPageProps> = ({ onBack, onCreateAndStart }) => {
  const [deck, setDeck] = useState('anime-heroes');
  const [isPrivate, setIsPrivate] = useState(true);
  const [rounds, setRounds] = useState(3);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate random 6-character room code
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    onCreateAndStart(generatedCode);
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

        <h1 className="text-xl font-semibold text-white mb-1">Create Room</h1>
        <p className="text-xs text-zinc-400 mb-6">Configure match options for your duel.</p>

        <form onSubmit={handleCreate} className="space-y-5">
          {/* Deck Selection */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Character Deck</label>
            <select
              value={deck}
              onChange={(e) => setDeck(e.target.value)}
              className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-white/40"
            >
              <option value="anime-heroes">Anime Heroes & Villains</option>
              <option value="classic-mystery">Classic Mystery Cast</option>
              <option value="sci-fi">Sci-Fi Legends</option>
            </select>
          </div>

          {/* Match Length */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">Best of Rounds</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRounds(num)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    rounds === num
                      ? 'bg-white/15 border-white/40 text-white'
                      : 'bg-black/20 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  {num} {num === 1 ? 'Round' : 'Rounds'}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs font-medium text-zinc-300">Private Room</p>
              <p className="text-[11px] text-zinc-500">Only players with code can join</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isPrivate ? 'bg-zinc-200' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-zinc-950 transition-transform ${
                  isPrivate ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-full bg-zinc-100 text-zinc-950 font-semibold text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 cursor-pointer"
          >
            Generate Room & Start
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomPage;