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

  // Matches the available DECKS item ID.
  const [deck, setDeck] = useState('characters');
  const [isPrivate, setIsPrivate] = useState(true);
  const [rounds, setRounds] = useState(3);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const roomCode = generateRoomCode();

    navigate('/pick-character', {
      state: {
        roomCode,
        from: 'create-room',
        deck,
        rounds,
        isPrivate,
      },
    });
  };

  return (
    <RoomPageShell>
      {/* Header */}
      <CreateRoomHeader onBack={() => navigate('/')} />

      {/* Responsive Scrollable Form */}
      <form
        onSubmit={handleCreate}
        className="
          flex-1 min-h-0 w-full
          p-4 sm:p-5 md:p-6
          overflow-y-auto overflow-x-hidden
          space-y-5 sm:space-y-6
          custom-scrollbar
        "
      >
        {/* Deck Selection */}
        <DeckSelector
          selectedDeck={deck}
          onSelectDeck={setDeck}
        />

        {/* Match Structure */}
        <MatchStructureSelector
          selectedRounds={rounds}
          onSelectRounds={setRounds}
        />

        {/* Privacy Toggle */}
        <RoomPrivacyToggle
          isPrivate={isPrivate}
          onTogglePrivate={setIsPrivate}
        />

        {/* Submit Button */}
        <CreateRoomSubmitButton />
      </form>
    </RoomPageShell>
  );
};

export default CreateRoomPage;