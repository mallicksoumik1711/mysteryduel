import React from 'react';

interface RoomPageShellProps {
  children: React.ReactNode;
}

/**
 * Shared full-screen shell for Create Room and Join Room pages.
 * Provides the centered glassmorphic card layout on the dark background.
 */
export const RoomPageShell: React.FC<RoomPageShellProps> = ({ children }) => (
  <div
    className="relative flex items-center justify-center h-screen w-full bg-[#111612] text-[#FFFFFF] font-sans flex flex-col overflow-hidden bg-center"
    style={{
      backgroundImage: `
        linear-gradient(rgba(4, 5, 4, 0.8), rgba(5, 8, 6, 0.92)),
        url('https://i.pinimg.com/736x/20/59/5e/20595ec67835acca47786d245daaabe2.jpg')
      `,
    }}
  >
    <div className="relative z-10 w-full max-w-lg border border-[#2E3830] rounded-sm backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[92vh]">
      {children}
    </div>
  </div>
);
