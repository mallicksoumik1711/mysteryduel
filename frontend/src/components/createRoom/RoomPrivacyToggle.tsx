import React from 'react';

interface RoomPrivacyToggleProps {
  isPrivate: boolean;
  onTogglePrivate: (newValue: boolean) => void;
}

export const RoomPrivacyToggle: React.FC<RoomPrivacyToggleProps> = ({ isPrivate, onTogglePrivate }) => {
  return (
    <div className="p-3.5 bg-[#171C18]/60 border border-[#2E3830] rounded-xl flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-[#FFFFFF]">Room Privacy</p>
          <span
            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
              isPrivate
                ? 'bg-[#93DD35]/15 text-[#93DD35] border-[#93DD35]/40'
                : 'bg-[#C2CDC3]/15 text-[#C2CDC3] border-[#C2CDC3]/40'
            }`}
          >
            {isPrivate ? 'INVITE ONLY' : 'PUBLIC LOBBY'}
          </span>
        </div>
        <p className="text-[11px] text-[#C2CDC3]">
          {isPrivate
            ? 'Players must enter code to join your room'
            : 'Anyone can discover and join this match'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onTogglePrivate(!isPrivate)}
        className={`w-12 h-7 rounded-full transition-all relative cursor-pointer border ${
          isPrivate
            ? 'bg-[#93DD35]/20 border-[#93DD35]/60'
            : 'bg-[#2E3830] border-[#2E3830]'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-200 flex items-center justify-center shadow-md ${
            isPrivate
              ? 'translate-x-5 bg-[#93DD35] text-[#171C18]'
              : 'translate-x-0 bg-[#C2CDC3] text-[#171C18]'
          }`}
        >
          {isPrivate ? (
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
};
