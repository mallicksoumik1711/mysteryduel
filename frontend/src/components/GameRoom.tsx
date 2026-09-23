// import React, { useState } from 'react';
// import { mockCharacters } from '../data/mockCharacters';
// import type { BoardState } from '../types';
// import { CharacterGrid } from './CharacterGrid';
// import { TurnIndicator } from './TurnIndicator';

// interface GameRoomProps {
//   onLeaveRoom?: () => void;
//   roomId?: string;
// }

// export const GameRoom: React.FC<GameRoomProps> = ({ onLeaveRoom, roomId = 'ROOM-8821' }) => {
//   // Simulate local state for the board
//   const [boardState, setBoardState] = useState<BoardState>({});
//   const [isYourTurn, setIsYourTurn] = useState(true);

//   // Handle clicking a character card
//   const handleCharacterClick = (characterId: string) => {
//     setBoardState(prev => {
//       const currentState = prev[characterId] || 'available';
//       let nextState: 'available' | 'selected' | 'eliminated' = 'available';

//       // Cycle through states: available -> selected -> eliminated -> available
//       if (currentState === 'available') nextState = 'selected';
//       else if (currentState === 'selected') nextState = 'eliminated';
//       else if (currentState === 'eliminated') nextState = 'available';

//       return { ...prev, [characterId]: nextState };
//     });
//   };

//   return (
//     <div className="relative min-h-screen w-full bg-[#0f0608] text-zinc-100 font-sans flex flex-col overflow-x-hidden select-none">
//       {/* Grain Texture Overlay */}
//       <div
//         className="pointer-events-none fixed inset-0 z-50 opacity-[0.06] mix-blend-overlay"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
//           backgroundSize: '256px 256px',
//         }}
//       />

//       {/* Deep Radial Vignette Background */}
//       <div
//         className="pointer-events-none fixed inset-0 z-0"
//         style={{
//           background: 'radial-gradient(ellipse 90% 70% at 50% 40%, #2b1018 0%, #160a0d 45%, #0a0306 100%)',
//         }}
//       />

//       {/* Side Flare Gradients */}
//       <div
//         className="pointer-events-none fixed inset-y-0 left-0 z-0 w-[48%]"
//         style={{ background: 'linear-gradient(to right, rgba(120,50,20,0.55) 0%, transparent 100%)' }}
//       />
//       <div
//         className="pointer-events-none fixed inset-y-0 right-0 z-0 w-[48%]"
//         style={{ background: 'linear-gradient(to left, rgba(120,50,20,0.55) 0%, transparent 100%)' }}
//       />

//       {/* Header */}
//       <header className="relative z-40 border-b border-white/10 bg-[#0f0608]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-white font-bold text-xs shadow-inner">
//             MD
//           </div>
//           <div>
//             <h1 className="text-lg font-bold text-white tracking-wide uppercase">
//               MysteryDuel
//             </h1>
//             <p className="text-[11px] text-zinc-500 font-mono tracking-wider">
//               {roomId}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setIsYourTurn(!isYourTurn)}
//             className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/20 text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white/35 transition-all text-xs font-medium cursor-pointer"
//           >
//             Toggle Turn (Debug)
//           </button>
//           {onLeaveRoom && (
//             <button
//               onClick={onLeaveRoom}
//               className="px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 hover:text-white transition-all text-xs font-medium cursor-pointer"
//             >
//               Leave Room
//             </button>
//           )}
//         </div>
//       </header>

//       {/* Main Game Content */}
//       <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
//         <TurnIndicator
//           isYourTurn={isYourTurn}
//           playerName="Player 1"
//           opponentName="Player 2"
//         />

//         <div className="flex-1">
//           <CharacterGrid
//             characters={mockCharacters}
//             boardState={boardState}
//             onCharacterClick={handleCharacterClick}
//           />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default GameRoom;






















import React, { useState } from 'react';
import { mockCharacters } from '../data/mockCharacters';
import type { BoardState } from '../types';
import { CharacterGrid } from './CharacterGrid';
import { TurnIndicator } from './TurnIndicator';

interface GameRoomProps {
  onLeaveRoom?: () => void;
  roomId?: string;
}

interface Question {
  id: string;
  category: string;
  text: string;
}

const MOCK_QUESTIONS: Question[] = [
  { id: 'q1', category: 'Hair', text: 'Does the character have dark hair?' },
  { id: 'q2', category: 'Hair', text: 'Is the character blond or light-haired?' },
  { id: 'q3', category: 'Accessories', text: 'Is the character wearing glasses or goggles?' },
  { id: 'q4', category: 'Accessories', text: 'Is the character wearing a hat or headwear?' },
  { id: 'q5', category: 'Facial Features', text: 'Does the character have facial hair?' },
  { id: 'q6', category: 'Expression', text: 'Is the character smiling or laughing?' },
  { id: 'q7', category: 'Attire', text: 'Is the character wearing dark clothing?' },
  { id: 'q8', category: 'Gender', text: 'Is the character female?' },
];

interface LogEntry {
  id: string;
  sender: 'You' | 'Opponent';
  text: string;
  answer?: 'Yes' | 'No';
  timestamp: string;
}

export const GameRoom: React.FC<GameRoomProps> = ({ onLeaveRoom, roomId = 'ROOM-8821' }) => {
  const [boardState, setBoardState] = useState<BoardState>({});
  const [isYourTurn, setIsYourTurn] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // Communication & activity log state
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      sender: 'Opponent',
      text: 'Does your character have dark hair?',
      answer: 'Yes',
      timestamp: '10:42 AM',
    },
    {
      id: '2',
      sender: 'You',
      text: 'Is the character wearing glasses?',
      answer: 'No',
      timestamp: '10:43 AM',
    },
  ]);

  // Cycle character state: available -> selected -> eliminated -> available
  const handleCharacterClick = (characterId: string) => {
    setBoardState((prev) => {
      const currentState = prev[characterId] || 'available';
      let nextState: 'available' | 'selected' | 'eliminated' = 'available';

      if (currentState === 'available') nextState = 'selected';
      else if (currentState === 'selected') nextState = 'eliminated';
      else if (currentState === 'eliminated') nextState = 'available';

      return { ...prev, [characterId]: nextState };
    });
  };

  const handleAskQuestion = (questionText: string) => {
    if (!isYourTurn) return;

    const newLog: LogEntry = {
      id: Date.now().toString(),
      sender: 'You',
      text: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLogs((prev) => [...prev, newLog]);
    setSelectedQuestion(null);
    setIsYourTurn(false); // Pass turn to opponent after asking
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0f0608] text-zinc-100 font-sans flex flex-col overflow-x-hidden select-none">
      {/* Grain Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Deep Radial Vignette Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% 40%, #2b1018 0%, #160a0d 45%, #0a0306 100%)',
        }}
      />

      {/* Side Flare Gradients */}
      <div
        className="pointer-events-none fixed inset-y-0 left-0 z-0 w-[48%]"
        style={{ background: 'linear-gradient(to right, rgba(120,50,20,0.55) 0%, transparent 100%)' }}
      />
      <div
        className="pointer-events-none fixed inset-y-0 right-0 z-0 w-[48%]"
        style={{ background: 'linear-gradient(to left, rgba(120,50,20,0.55) 0%, transparent 100%)' }}
      />

      {/* Main Container - Divided into 3 Sections */}
      <main className="relative z-10 flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ==========================================
            PART 1: COMMUNICATION & MATCH STATUS
           ========================================== */}
        <section className="lg:col-span-3 flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          {/* Room Controls Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block">Room ID</span>
              <span className="text-xs font-mono font-bold text-zinc-200">{roomId}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsYourTurn(!isYourTurn)}
                className="px-2 py-1 rounded-md bg-white/5 border border-white/15 text-[10px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Toggle Turn for debugging"
              >
                Debug Turn
              </button>
              {onLeaveRoom && (
                <button
                  onClick={onLeaveRoom}
                  className="px-2.5 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-[11px] font-medium text-red-300 hover:bg-red-900/60 hover:text-white transition-all cursor-pointer"
                >
                  Leave
                </button>
              )}
            </div>
          </div>

          {/* Turn Status */}
          <TurnIndicator
            isYourTurn={isYourTurn}
            playerName="You"
            opponentName="Opponent"
          />

          {/* Communication & Question Log */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Communication Log</h3>
            <div className="h-[220px] overflow-y-auto pr-1 space-y-2.5 text-xs">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-xl border ${
                    log.sender === 'You'
                      ? 'bg-white/5 border-white/15 text-zinc-200 ml-2'
                      : 'bg-zinc-900/80 border-white/10 text-zinc-300 mr-2'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                    <span className="font-semibold">{log.sender}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="leading-snug">{log.text}</p>
                  {log.answer && (
                    <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400">Answer:</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          log.answer === 'Yes'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {log.answer}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Secret Character Private Card */}
          <div className="pt-3 border-t border-white/10 flex items-center gap-3">
            <div className="w-12 h-16 rounded-lg bg-zinc-900 border border-white/20 overflow-hidden shrink-0">
              <img
                src={mockCharacters[0]?.imageUrl}
                alt="Your secret character"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] text-amber-400/90 font-mono uppercase tracking-wider block">Private</span>
              <p className="text-xs font-semibold text-white">Your Secret Character</p>
              <p className="text-[11px] text-zinc-400">{mockCharacters[0]?.name || 'Unknown'}</p>
            </div>
          </div>
        </section>

        {/* ==========================================
            PART 2: CHARACTER BOARD
           ========================================== */}
        <section className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              Character Board
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              {mockCharacters.length} Total
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <CharacterGrid
              characters={mockCharacters}
              boardState={boardState}
              onCharacterClick={handleCharacterClick}
            />
          </div>
        </section>

        {/* ==========================================
            PART 3: QUESTIONS LIST
           ========================================== */}
        <section className="lg:col-span-3 flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="pb-2 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white tracking-wide">Ask a Question</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {isYourTurn ? 'Select a question to narrow down the secret character.' : 'Wait for opponent to respond...'}
            </p>
          </div>

          <div className="max-h-[500px] overflow-y-auto pr-1 flex flex-col gap-2">
            {MOCK_QUESTIONS.map((q) => {
              const isSelected = selectedQuestion === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => isYourTurn && setSelectedQuestion(q.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    !isYourTurn
                      ? 'opacity-50 cursor-not-allowed border-white/5 bg-black/20'
                      : isSelected
                      ? 'bg-white/15 border-white/40 text-white'
                      : 'bg-black/30 border-white/10 text-zinc-300 hover:border-white/25 hover:bg-black/50'
                  }`}
                >
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1">
                    {q.category}
                  </span>
                  <p className="text-xs font-medium leading-snug">{q.text}</p>

                  {isSelected && isYourTurn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAskQuestion(q.text);
                      }}
                      className="w-full mt-2.5 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 font-semibold text-xs hover:bg-white transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      Submit Question
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};

export default GameRoom;

