import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreateRoomHeader,
  DeckSelector,
  MatchStructureSelector,
  RoomPrivacyToggle,
  CreateRoomSubmitButton,
} from '@/components/createRoom/CreateRoomExports';

const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [deck, setDeck] = useState('anime-heroes');
  const [isPrivate, setIsPrivate] = useState(true);
  const [rounds, setRounds] = useState(3);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate('/pick-character', { state: { roomCode, from: 'create-room', deck, rounds, isPrivate } });
  };

  return (
    // Background: Rangoon Green (#171C18)
    <div className="relative h-screen w-full bg-[#171C18] text-[#FFFFFF] font-sans flex items-center justify-center p-4 overflow-hidden antialiased">
      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-lg bg-[#202621]/95 border border-[#2E3830] rounded-2xl backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Component */}
        <CreateRoomHeader onBack={() => navigate('/')} />

        {/* Scrollable Form Body */}
        <form onSubmit={handleCreate} className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
          
          {/* Deck Selection Component */}
          <DeckSelector selectedDeck={deck} onSelectDeck={setDeck} />

          {/* Match Structure Component */}
          <MatchStructureSelector selectedRounds={rounds} onSelectRounds={setRounds} />

          {/* Privacy Toggle Component */}
          <RoomPrivacyToggle isPrivate={isPrivate} onTogglePrivate={setIsPrivate} />

          {/* Submit Action Button Component */}
          <CreateRoomSubmitButton />
        </form>

      </div>
    </div>
  );
};

export default CreateRoomPage;