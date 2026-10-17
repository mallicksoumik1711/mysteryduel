import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CreateRoomPage from '../pages/CreateRoomPage';
import JoinRoomPage from '../pages/JoinRoomPage';
import PickCharacterPage from '../pages/PickCharacterPage';
import GameRoomPage from '../pages/GameRoomPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create-room" element={<CreateRoomPage />} />
      <Route path="/join-room" element={<JoinRoomPage />} />
      <Route path="/pick-character" element={<PickCharacterPage />} />
      <Route path="/game-room" element={<GameRoomPage />} />
      {/* Fallback: redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
