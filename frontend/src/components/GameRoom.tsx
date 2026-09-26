import React, { useState } from 'react';
import { mockCharacters } from '../data/mockCharacters';
import type { BoardState, Character } from '../types';
import { CharacterGrid } from './CharacterGrid';
import { GameHeader } from './gameRoom/GameHeader';
import { MatchIntelPanel } from './gameRoom/MatchIntelPanel';
import { InterrogationPanel } from './gameRoom/InterrogationPanel';
import { MOCK_QUESTIONS } from './gameRoom/gameRoom.types';
import type { LogEntry } from './gameRoom/gameRoom.types';

interface GameRoomProps {
  onLeaveRoom?: () => void;
  roomId?: string;
  userCharacter?: Character | null;
}

export const GameRoom: React.FC<GameRoomProps> = ({ onLeaveRoom, roomId = 'ROOM-8821', userCharacter }) => {
  const secretCharacter = userCharacter ?? mockCharacters[0];
  const [boardState, setBoardState] = useState<BoardState>({});
  const [isYourTurn, setIsYourTurn] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

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

      <GameHeader
        roomId={roomId}
        onToggleTurn={() => setIsYourTurn(!isYourTurn)}
        onLeaveRoom={onLeaveRoom}
      />

      {/* Main Single-Screen Workspace */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1800px] mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4 overflow-hidden">

        <MatchIntelPanel
          isYourTurn={isYourTurn}
          logs={logs}
          secretCharacter={secretCharacter}
        />

        {/* Character Board */}
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

        <InterrogationPanel
          isYourTurn={isYourTurn}
          questions={MOCK_QUESTIONS}
          selectedQuestion={selectedQuestion}
          onSelectQuestion={setSelectedQuestion}
          onAskQuestion={handleAskQuestion}
        />

      </main>
    </div>
  );
};

export default GameRoom;