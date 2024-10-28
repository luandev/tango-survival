import React, { Fragment, useState } from 'react';
import Grid from './components/Grid';
import { GameProvider } from './context/GameContext';
import CountdownTimer from './components/CountdownTimer';
import Modal from './components/Modal';
import LevelIndicator from './components/LevelIndicator';
import withGridHandling from './hoc/withGridHandling';
import withPersistentStorage from './hoc/withPersistentStorage';
import './App.css';

const initialSize = 4;
const EnhancedGrid = withGridHandling(Grid, { size: initialSize, gridData: Array.from({ length: initialSize }, () => Array(initialSize).fill(null)) });

function App() {
  const totalLevels = 10;
  const [level, setLevel] = useState(1);
  const [time, setTime] = useState(15000);
  const [showModal, setShowModal] = useState(true);

  const PersistentStartGameModal = withPersistentStorage(Modal, 'gameStarted');

  const handleStartGame = () => {
    console.log('Game started!');
    setShowModal(false);
  };

  const handleComplete = () => {
    console.log('Countdown completed!');
  };

  const handleLevelUp = () => {
    setLevel((prevLevel) => prevLevel + 1);
    setTime(15000); // Reset the timer for the new level, if necessary
  };

  return (
    <Fragment>
      <header>
        <h1>💃 tango 💃</h1>
        <LevelIndicator currentLevel={level} totalLevels={totalLevels} />
      </header>
      <main>
        <GameProvider>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CountdownTimer time={time} onComplete={handleComplete} isPaused={showModal} />
            <EnhancedGrid onLevelUp={handleLevelUp} /> 
          </div>
        </GameProvider>
      </main>
      <footer style={{ marginTop: '20px' }}>
        <p>⭐ Gimme a star on GitHub ⭐</p>
      </footer>
      {showModal && (
        <PersistentStartGameModal 
          message="Are you ready to start the game?"
          showOk={true}
          modalId={"intro_message"}
          showCheckbox={true}
          showCancel={false}
          onOk={handleStartGame}
        />
      )}
    </Fragment>
  );
}

export default App;
