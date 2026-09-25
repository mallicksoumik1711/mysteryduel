import React, { useState } from 'react';
import { mockCharacters } from '../data/mockCharacters';
import type { BoardState, Character } from '../types';
import { CharacterGrid } from './CharacterGrid';
import { TurnIndicator } from './TurnIndicator';

interface GameRoomProps {
  onLeaveRoom?: () => void;
  roomId?: string;
  userCharacter?: Character | null;
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

export const GameRoom: React.FC<GameRoomProps> = ({ onLeaveRoom, roomId = 'ROOM-8821', userCharacter }) => {
  const secretCharacter = userCharacter ?? mockCharacters[0];
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
    <div className="relative h-screen w-full bg-[#090406] text-zinc-100 font-sans flex flex-col overflow-hidden select-none antialiased">
      {/* Background Micro Grain Texture */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />
      
      {/* Ambient Lighting Layers */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-rose-900/15 blur-[140px] rounded-full z-0" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[400px] h-[400px] bg-amber-900/10 blur-[140px] rounded-full z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] bg-red-950/20 blur-[140px] rounded-full z-0" />

      {/* Header Bar */}
      <header className="shrink-0 z-20 w-full border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
            <h1 className="text-xs font-black tracking-[0.2em] uppercase bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Mysteryduel <span className="text-amber-500 font-mono text-[11px] ml-1">// ARENA</span>
            </h1>
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/10">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">ROOM:</span>
            <span className="text-xs font-mono font-bold text-amber-400">{roomId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsYourTurn(!isYourTurn)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            title="Toggle Turn for debugging"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Debug Turn
          </button>

          {onLeaveRoom && (
            <button
              onClick={onLeaveRoom}
              className="px-3 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-[11px] font-semibold text-red-300 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
            >
              Leave Game
            </button>
          )}
        </div>
      </header>

      {/* Main Single-Screen Workspace */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1800px] mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4 overflow-hidden">
        
        {/* ==========================================
            PART 1: COMMUNICATION & MATCH STATUS
           ========================================== */}
        <section className="lg:col-span-3 flex flex-col h-full min-h-0 bg-zinc-900/40 border border-white/10 rounded-xl backdrop-blur-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="shrink-0 px-3.5 py-2.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
              <h2 className="text-[11px] font-bold text-white uppercase tracking-widest font-mono">
                Match Intel
              </h2>
            </div>
            <span className="text-[9px] font-mono text-zinc-400 uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
              LIVE LOG
            </span>
          </div>

          <div className="p-3 flex-1 min-h-0 flex flex-col gap-3">
            {/* Turn Status Widget */}
            <div className="shrink-0 bg-black/40 border border-white/10 rounded-lg p-2.5 shadow-inner">
              <TurnIndicator
                isYourTurn={isYourTurn}
                playerName="You"
                opponentName="Opponent"
              />
            </div>

            {/* Communication Log Feed */}
            <div className="flex-1 min-h-0 flex flex-col gap-1.5">
              <div className="shrink-0 flex items-center justify-between px-0.5">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                  Activity Feed
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">{logs.length} messages</span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-lg border transition-all ${
                      log.sender === 'You'
                        ? 'bg-amber-500/5 border-amber-500/20 text-zinc-100 ml-2'
                        : 'bg-zinc-950/80 border-white/10 text-zinc-200 mr-2 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] text-zinc-400 font-mono mb-1">
                      <span className={`font-bold ${log.sender === 'You' ? 'text-amber-400' : 'text-zinc-300'}`}>
                        {log.sender}
                      </span>
                      <span className="text-zinc-500">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] leading-snug text-zinc-200 font-medium">{log.text}</p>
                    {log.answer && (
                      <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase text-zinc-400">Response</span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shadow-sm ${
                            log.answer === 'Yes'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
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
            <div className="shrink-0 pt-2 border-t border-white/10">
              <div className="relative group overflow-hidden bg-gradient-to-br from-zinc-900/90 to-black p-2.5 rounded-lg border border-amber-500/30 shadow-md flex items-center gap-3">
                <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 blur-lg rounded-full pointer-events-none" />
                
                <div className="relative w-11 h-14 rounded bg-zinc-950 border border-amber-500/40 overflow-hidden shrink-0 shadow">
                  <img
                    src={secretCharacter?.imageUrl}
                    alt="Your secret character"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[9px] text-amber-400 font-mono font-bold uppercase tracking-widest">
                      Your Secret Target
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">{secretCharacter?.name || 'Unknown'}</p>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">Private Card</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            PART 2: CHARACTER BOARD
           ========================================== */}
        <section className="lg:col-span-6 flex flex-col h-full min-h-0 bg-zinc-900/40 border border-white/10 rounded-xl backdrop-blur-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="shrink-0 px-3.5 py-2.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-rose-500 rounded-full" />
              <h2 className="text-[11px] font-bold text-white uppercase tracking-widest font-mono">
                Tactical Board
              </h2>
            </div>
            <div className="flex items-center gap-2.5 font-mono text-[10px]">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                <span className="text-zinc-400">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-zinc-400">Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-zinc-400">Eliminated</span>
              </div>
            </div>
          </div>

          {/* Grid Container */}
          <div className="p-3 sm:p-4 flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 flex flex-col justify-center">
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
        <section className="lg:col-span-3 flex flex-col h-full min-h-0 bg-zinc-900/40 border border-white/10 rounded-xl backdrop-blur-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="shrink-0 px-3.5 py-2.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
              <h2 className="text-[11px] font-bold text-white uppercase tracking-widest font-mono">
                Interrogation
              </h2>
            </div>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
              isYourTurn 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-zinc-800 text-zinc-500 border-white/5'
            }`}>
              {isYourTurn ? 'YOUR TURN' : 'WAITING'}
            </span>
          </div>

          <div className="p-3 flex-1 min-h-0 flex flex-col gap-2">
            <p className="shrink-0 text-[11px] text-zinc-400 font-medium leading-tight">
              {isYourTurn 
                ? 'Select a question to submit:' 
                : 'Waiting for opponent response...'}
            </p>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
              {MOCK_QUESTIONS.map((q) => {
                const isSelected = selectedQuestion === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => isYourTurn && setSelectedQuestion(q.id)}
                    className={`group relative p-2.5 rounded-lg border transition-all duration-150 ${
                      !isYourTurn
                        ? 'opacity-40 cursor-not-allowed border-white/5 bg-black/20'
                        : isSelected
                        ? 'bg-gradient-to-r from-amber-500/20 to-zinc-900 border-amber-500/50 shadow-md text-white'
                        : 'bg-black/30 border-white/10 text-zinc-300 hover:border-white/25 hover:bg-black/50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-mono text-amber-400/90 font-semibold uppercase tracking-wider">
                        {q.category}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    <p className="text-[11px] font-medium leading-snug">{q.text}</p>

                    {isSelected && isYourTurn && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAskQuestion(q.text);
                        }}
                        className="w-full mt-2 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-98 flex items-center justify-center gap-1"
                      >
                        <span>Submit Question</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default GameRoom;