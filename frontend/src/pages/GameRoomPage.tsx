import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { GameRoom } from '../components/GameRoom';
import type { Character } from '../types';

/**
 * GameRoomPage
 *
 * Expects location.state = { roomCode: string, character: Character }
 * passed by PickCharacterPage via navigate().
 *
 * On leave → navigates back to home.
 */
const GameRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { roomCode: string; character: Character } | null;

  // Guard: if someone lands here without state, send them home
  if (!state?.roomCode || !state?.character) {
    return <Navigate to="/" replace />;
  }

  return (
    <GameRoom
      onLeaveRoom={() => navigate('/')}
      roomId={state.roomCode}
      userCharacter={state.character}
    />
  );
};

export default GameRoomPage;
