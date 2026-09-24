import { useState } from 'react';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import { GameRoom } from './components/GameRoom';
import { PickCharacter } from './components/PickCharacter';
import type { Character } from './types';

export type AppState = 'home' | 'create-room' | 'join-room' | 'pick-character' | 'game';

function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [roomId, setRoomId] = useState<string>('');
  const [userCharacter, setUserCharacter] = useState<Character | null>(null);
  // Track where the user came from so Back on PickCharacter goes to the right page
  const [prePickState, setPrePickState] = useState<'create-room' | 'join-room'>('create-room');

  const handleRoomReady = (code: string, from: 'create-room' | 'join-room') => {
    setRoomId(code);
    setPrePickState(from);
    setAppState('pick-character');
  };

  if (appState === 'game') {
    return (
      <GameRoom
        onLeaveRoom={() => setAppState('home')}
        roomId={roomId}
        userCharacter={userCharacter}
      />
    );
  }

  if (appState === 'pick-character') {
    return (
      <PickCharacter
        onBack={() => setAppState(prePickState)}
        onConfirm={(character) => {
          setUserCharacter(character);
          setAppState('game');
        }}
      />
    );
  }

  if (appState === 'create-room') {
    return (
      <CreateRoomPage
        onBack={() => setAppState('home')}
        onCreateAndStart={(code) => handleRoomReady(code, 'create-room')}
      />
    );
  }

  if (appState === 'join-room') {
    return (
      <JoinRoomPage
        onBack={() => setAppState('home')}
        onJoinAndStart={(code) => handleRoomReady(code, 'join-room')}
      />
    );
  }

  return (
    <HomePage
      onCreateRoom={() => setAppState('create-room')}
      onJoinRoom={() => setAppState('join-room')}
    />
  );
}

export default App;