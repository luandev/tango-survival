// App.js
import React, { Fragment, useState } from 'react';
import Grid from './components/Grid';
import { GameProvider } from './context/GameContext';
import CountdownTimer from './components/CountdownTimer';
import Modal from './components/Modal';
import LevelIndicator from './components/LevelIndicator';
import withGridHandling from './hoc/withGridHandling';
import { levels } from './levels';
import './App.css';

const EnhancedGrid = withGridHandling(Grid);

function App() {
  const totalLevels = levels.length;
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = levels[levelIndex];

  const [time, setTime] = useState(15000);
  const [showModal, setShowModal] = useState(true);


  const handleStartGame = () => {
    console.log('Game started!');
    setShowModal(false);
  };

  const handleComplete = () => {
    console.log('Countdown completed!');
    // TODO game over modal
  };

  const handleLevelUp = () => {
    if (levelIndex < totalLevels - 1) {
      setLevelIndex((prevIndex) => prevIndex + 1);
      setTime(15000);
    } else {
      console.log('All levels completed!');
    }
  };


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
              levelData={currentLevel}
            />
          </div>
        </GameProvider>
      </main>
      <footer >
        <p>⭐ Gimme a star on GitHub ⭐</p>
      </footer>
      {showModal && (
        <Modal
          message="Are you ready to start the game?"
          showOk={true}
          modalId={"intro_message"}
          showCheckbox={true}
          showCancel={false}
          onOk={handleStartGame}
        />)}
    </Fragment>
  );
}

export default App;
