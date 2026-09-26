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

      {/* Activity Log Feed */}
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

      {/* Secret Character Card */}
      <div className="shrink-0 pt-2 border-t border-white/10">
        <div className="relative group overflow-hidden bg-gradient-to-br from-zinc-900/90 to-black p-2.5 rounded-lg border border-amber-500/30 shadow-md flex items-center gap-3">
          <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 blur-lg rounded-full pointer-events-none" />

          <div className="relative w-11 h-14 rounded bg-zinc-950 border border-amber-500/40 overflow-hidden shrink-0 shadow">
            <img
              src={secretCharacter.imageUrl}
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
            <p className="text-xs font-bold text-white truncate">{secretCharacter.name || 'Unknown'}</p>
            <p className="text-[10px] text-zinc-400 font-mono truncate">Private Card</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
