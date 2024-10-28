// App.js
import React, { Fragment, useState } from 'react';
import Grid from './components/Grid';
import { GameProvider } from './context/GameContext';
import CountdownTimer from './components/CountdownTimer';
import Modal from './components/Modal';
import LevelIndicator from './components/LevelIndicator';
import withGridHandling from './hoc/withGridHandling';
import withPersistentStorage from './hoc/withPersistentStorage';
import { levels } from './levels'; // Import levels data
import './App.css';

// Wrap the Grid component with grid handling logic
const EnhancedGrid = withGridHandling(Grid);

function App() {
  const totalLevels = levels.length;
  const [levelIndex, setLevelIndex] = useState(0); // Track current level index
  const [time, setTime] = useState(15000);
  const [showModal, setShowModal] = useState(true);

  const PersistentStartGameModal = withPersistentStorage(Modal, 'gameStarted');

  const handleStartGame = () => {
    console.log('Game started!');
    setShowModal(false);
  };

  const handleComplete = () => {
    console.log('Countdown completed!');
    // Handle game over logic here
  };

  const handleLevelUp = () => {
    if (levelIndex < totalLevels - 1) {
      setLevelIndex((prevIndex) => prevIndex + 1);
      setTime(15000); // Reset the timer for the new level
    } else {
      console.log('All levels completed!');
      // Handle end-of-game logic here, such as showing a congratulatory message
    }
  };

  const currentLevel = levels[levelIndex]; // Get current level data

  return (
    <Fragment>
      <header>
        <h1>💃 tango 💃</h1>
        <LevelIndicator currentLevel={currentLevel.level} totalLevels={totalLevels} />
      </header>
      <main>
        <GameProvider>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CountdownTimer time={time} onComplete={handleComplete} isPaused={showModal} />
            <EnhancedGrid
              onLevelUp={handleLevelUp}
              size={currentLevel.size}
              gridData={currentLevel.gridData}
            /> {/* Pass current level data */}
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
