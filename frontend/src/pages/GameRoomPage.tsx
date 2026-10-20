import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { GameRoom } from '../components/GameRoom';
import type { Character } from '../types';

/**
 * GameRoomPage
 *
 * Expects location.state = { roomCode: string, character: Character, playerId: string }
 * passed by PickCharacterPage via navigate().
 *
 * On leave → navigates back to home.
 */
const GameRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { roomCode: string; character: Character; playerId?: string } | null;

  // Guard: if someone lands here without state, send them home
  if (!state?.roomCode || !state?.character) {
    return <Navigate to="/" replace />;
  }

  // Use playerId from state; fall back to a stable random ID if not provided
  const playerId = state.playerId ?? `player-${state.roomCode}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <GameRoom
      onLeaveRoom={() => navigate('/')}
      roomId={state.roomCode}
      userCharacter={state.character}
      playerId={playerId}
    />
  );
};

export default GameRoomPage;