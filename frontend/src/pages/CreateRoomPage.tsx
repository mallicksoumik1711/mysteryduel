import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreateRoomHeader,
  DeckSelector,
  MatchStructureSelector,
  RoomPrivacyToggle,
  CreateRoomSubmitButton,
} from '@/components/createRoom/CreateRoomExports';
import { RoomPageShell } from '@/components/ui/RoomPageShell';
import { generateRoomCode } from '@/utils/roomCode';

const CreateRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [deck, setDeck] = useState('anime-heroes');
  const [isPrivate, setIsPrivate] = useState(true);
  const [rounds, setRounds] = useState(3);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const roomCode = generateRoomCode();
    navigate('/pick-character', { state: { roomCode, from: 'create-room', deck, rounds, isPrivate } });
  };

  return (
    <RoomPageShell>
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
    </RoomPageShell>
  );
};

export default CreateRoomPage;