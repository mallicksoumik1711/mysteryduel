import React from 'react';

interface CreateRoomHeaderProps {
  onBack: () => void;
}

export const CreateRoomHeader: React.FC<CreateRoomHeaderProps> = ({
  onBack,
}) => {
  return (
    <div
      className="
        shrink-0 w-full
        p-4 sm:p-5 md:p-6 pb-4
        border-b border-[#2E3830]
        bg-[#171C18]/60
        flex flex-col gap-3
      "
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        type="button"
        className="
          self-start
          min-h-9
          text-xs font-mono
          text-[#C2CDC3]
          hover:text-[#FFFFFF]
          transition-all
          flex items-center gap-2
          cursor-pointer group
          bg-[#2E3830]/50
          hover:bg-[#2E3830]
          px-3 py-1.5
          border border-[#2E3830]
        "
      >
        <span className="group-hover:-translate-x-1 transition-transform">
          ←
        </span>

        <span>BACK TO LOBBY</span>
      </button>

      {/* Header Content */}
      <div className="flex items-center justify-between gap-3 mt-1 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="
                w-2 h-2 shrink-0
                rounded-full
                bg-[#93DD35]
                animate-pulse
                shadow-[0_0_10px_rgba(147,221,53,0.7)]
              "
            />

            <span
              className="
                text-[10px] font-mono font-bold
                text-[#93DD35]
                uppercase tracking-widest
              "
            >
              MATCH SETUP
            </span>
          </div>

          <h1
            className="
              londrina-solid-regular
              text-xl sm:text-2xl
              font-black
              text-[#FFFFFF]
              tracking-widest
              uppercase
              leading-tight
              break-words
            "
          >
            Create Duel Room
          </h1>
        </div>

        {/* Custom Lobby Badge */}
        <span
          className="
            shrink-0
            text-[9px] sm:text-xs
            font-mono
            text-[#C2CDC3]
            bg-[#171C18]
            px-2 sm:px-2.5
            py-1
            rounded
            border border-[#2E3830]
            whitespace-nowrap
          "
        >
          CUSTOM LOBBY
        </span>
      </div>
    </div>
  );
};