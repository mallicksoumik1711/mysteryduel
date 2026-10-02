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
    setIsYourTurn(false);
  };

  return (
    <div
      className="relative h-screen w-full bg-[#111612] text-[#FFFFFF] font-sans flex flex-col overflow-hidden bg-center"
      style={{
        backgroundImage: `
        linear-gradient(rgba(4, 5, 4, 0.8), rgba(5, 8, 6, 0.92)),
        url('https://i.pinimg.com/736x/f5/e5/47/f5e5475127ab0cd4f9681e67fad5b623.jpg')
      `,
      }}
    >

      {/* Ambient Lighting Layers */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-[#93DD35]/10 blur-[140px] rounded-full z-0" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[400px] h-[400px] bg-[#202621]/40 blur-[140px] rounded-full z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] bg-[#93DD35]/5 blur-[140px] rounded-full z-0" />

      <GameHeader
        roomId={roomId}
        onToggleTurn={() => setIsYourTurn(!isYourTurn)}
        onLeaveRoom={onLeaveRoom}
      />

      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1800px] mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3.5 lg:gap-4 overflow-hidden">

        <MatchIntelPanel
          isYourTurn={isYourTurn}
          logs={logs}
          secretCharacter={secretCharacter}
        />

        <section className="lg:col-span-6 flex flex-col h-full min-h-0 border border-[#2E3830] rounded-xl backdrop-blur-sm shadow-xl overflow-hidden">
          <div className="shrink-0 px-3.5 py-2.5 border-b border-[#2E3830] bg-[#171C18]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 bg-[#93DD35] rounded-full shadow-[0_0_8px_rgba(147,221,53,0.5)]" />
              <h2 className="text-[11px] font-bold text-[#FFFFFF] uppercase tracking-widest font-mono">
                Tactical Board
              </h2>
            </div>
            <div className="flex items-center gap-2.5 font-mono text-[10px]">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2CDC3]/50" />
                <span className="text-[#C2CDC3]">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#93DD35]" />
                <span className="text-[#C2CDC3]">Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-[#C2CDC3]">Eliminated</span>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
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