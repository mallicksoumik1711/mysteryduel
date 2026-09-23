// import React, { useState } from 'react';
// import { GameRoom } from './components/GameRoom';
// import HomePage from './pages/HomePage';

// type AppState = 'home' | 'game' | 'create-room' | 'join-room';

// function App() {
//   const [appState, setAppState] = useState<AppState>('home');

//   if (appState === 'game') {
//     return <GameRoom onLeaveRoom={() => setAppState('home')} />;
//   }

//   return <HomePage onGetStarted={() => setAppState('game')} />;
// }

// export default App;




import { useState } from 'react';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import { GameRoom } from './components/GameRoom';

export type AppState = 'home' | 'create-room' | 'join-room' | 'game';

function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [roomId, setRoomId] = useState<string>('');

  const handleStartGame = (code?: string) => {
    if (code) setRoomId(code);
    setAppState('game');
  };

  if (appState === 'game') {
    return <GameRoom onLeaveRoom={() => setAppState('home')} roomId={roomId} />;
  }

  if (appState === 'create-room') {
    return (
      <CreateRoomPage
        onBack={() => setAppState('home')}
        onCreateAndStart={(code) => handleStartGame(code)}
      />
    );
  }

  if (appState === 'join-room') {
    return (
      <JoinRoomPage
        onBack={() => setAppState('home')}
        onJoinAndStart={(code) => handleStartGame(code)}
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