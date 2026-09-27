import React from 'react';
import { TurnIndicator } from '../TurnIndicator';
import type { Character } from '../../types';
import type { LogEntry } from './gameRoom.types';

interface MatchIntelPanelProps {
  isYourTurn: boolean;
  logs: LogEntry[];
  secretCharacter: Character;
}

export const MatchIntelPanel: React.FC<MatchIntelPanelProps> = ({
  isYourTurn,
  logs,
  secretCharacter,
}) => (
  <section className="lg:col-span-3 flex flex-col h-full min-h-0 bg-[#202621]/60 border border-[#2E3830] rounded-xl backdrop-blur-2xl shadow-xl overflow-hidden">
    {/* Header */}
    <div className="shrink-0 px-3.5 py-2.5 border-b border-[#2E3830] bg-[#171C18]/40 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-3.5 bg-[#93DD35] rounded-full shadow-[0_0_8px_rgba(147,221,53,0.5)]" />
        <h2 className="text-[11px] font-bold text-[#FFFFFF] uppercase tracking-widest font-mono">
          Match Intel
        </h2>
      </div>
      <span className="text-[9px] font-mono text-[#C2CDC3] uppercase px-1.5 py-0.5 rounded bg-[#171C18] border border-[#2E3830]">
        LIVE LOG
      </span>
    </div>

    <div className="p-3 flex-1 min-h-0 flex flex-col gap-3">
      {/* Turn Status Widget */}
      <div className="shrink-0 bg-[#171C18]/80 border border-[#2E3830] rounded-lg p-2.5 shadow-inner">
        <TurnIndicator
          isYourTurn={isYourTurn}
          playerName="You"
          opponentName="Opponent"
        />
      </div>

      {/* Activity Log Feed */}
      <div className="flex-1 min-h-0 flex flex-col gap-1.5">
        <div className="shrink-0 flex items-center justify-between px-0.5">
          <span className="text-[10px] font-semibold text-[#C2CDC3] uppercase tracking-wider font-mono">
            Activity Feed
          </span>
          <span className="text-[9px] text-[#C2CDC3]/60 font-mono">{logs.length} messages</span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-[#2E3830] hover:scrollbar-thumb-[#93DD35]/30">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg border transition-all ${
                log.sender === 'You'
                  ? 'bg-[#93DD35]/10 border-[#93DD35]/30 text-[#FFFFFF] ml-2'
                  : 'bg-[#171C18] border-[#2E3830] text-[#C2CDC3] mr-2 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] text-[#C2CDC3]/70 font-mono mb-1">
                <span className={`font-bold ${log.sender === 'You' ? 'text-[#93DD35]' : 'text-[#FFFFFF]'}`}>
                  {log.sender}
                </span>
                <span className="text-[#C2CDC3]/50">{log.timestamp}</span>
              </div>
              <p className="text-[11px] leading-snug text-[#FFFFFF] font-medium">{log.text}</p>
              {log.answer && (
                <div className="mt-1.5 pt-1.5 border-t border-[#2E3830] flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase text-[#C2CDC3]/60">Response</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shadow-sm ${
                      log.answer === 'Yes'
                        ? 'bg-[#93DD35]/15 text-[#93DD35] border-[#93DD35]/30'
                        : 'bg-red-500/15 text-red-300 border-red-500/30'
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

      {/* Secret Character Card */}
      <div className="shrink-0 pt-2 border-t border-[#2E3830]">
        <div className="relative group overflow-hidden bg-gradient-to-br from-[#171C18] to-[#101311] p-2.5 rounded-lg border border-[#93DD35]/40 shadow-md flex items-center gap-3">
          <div className="absolute top-0 right-0 w-12 h-12 bg-[#93DD35]/10 blur-lg rounded-full pointer-events-none" />

          <div className="relative w-11 h-14 rounded bg-[#171C18] border border-[#93DD35]/40 overflow-hidden shrink-0 shadow">
            <img
              src={secretCharacter.imageUrl}
              alt="Your secret character"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171C18]/80 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#93DD35] animate-pulse" />
              <span className="text-[9px] text-[#93DD35] font-mono font-bold uppercase tracking-widest">
                Your Secret Target
              </span>
            </div>
            <p className="text-xs font-black text-[#FFFFFF] truncate uppercase">{secretCharacter.name || 'Unknown'}</p>
            <p className="text-[10px] text-[#C2CDC3] font-mono truncate">Private Card</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);