import React from 'react';

interface RoomPageShellProps {
  children: React.ReactNode;
}

/**
 * Shared full-screen shell for Create Room and Join Room pages.
 * Provides the centered glassmorphic card layout on the dark background.
 */
export const RoomPageShell: React.FC<RoomPageShellProps> = ({ children }) => (
  <div className="relative h-screen w-full bg-[#171C18] text-[#FFFFFF] font-sans flex items-center justify-center p-4 overflow-hidden antialiased">
    <div className="relative z-10 w-full max-w-lg bg-[#202621]/95 border border-[#2E3830] rounded-2xl backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[92vh]">
      {children}
    </div>
  </div>
);
