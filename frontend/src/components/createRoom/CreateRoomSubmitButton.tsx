import React from 'react';

interface CreateRoomSubmitButtonProps {
  label?: string;
}

export const CreateRoomSubmitButton: React.FC<CreateRoomSubmitButtonProps> = ({
  label = 'GENERATE ROOM & START',
}) => {
  return (
    <button
      type="submit"
      className="w-full py-3.5 rounded-md bg-[#93DD35] hover:bg-[#85c82e] text-[#171C18] font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#93DD35]/25 active:scale-98 flex items-center justify-center gap-2 group"
    >
      <span>{label}</span>
      <svg
        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  );
};
