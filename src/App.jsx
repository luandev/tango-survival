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

  const [time, setTime] = useState(90000);
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
      setTime(time + 15000);
    } else {
      console.log('All levels completed!');
    }
  };


  return (
    <Fragment>
      <header>
        <h1>💃 tango</h1>
      </header>
      <main>
        <GameProvider>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <EnhancedGrid
              onLevelUp={handleLevelUp}
              levelData={currentLevel}
            />
            <CountdownTimer time={time} onComplete={handleComplete} isPaused={showModal} />
            <LevelIndicator currentLevel={currentLevel.level} totalLevels={totalLevels} />
          </div>
        </GameProvider>
      </main>
      <footer >
        <p>Gimme feedback and a ⭐ on <a href="https://github.com/luandev/tango-survival">GitHub</a>!</p>
      </footer>
      {showModal && (
        <Modal
          message={`
## Welcome to Tango!  
### Rules
- Max 2 reapeated shapes
- Rows and columns must match, like sudoku
- Run out of time? Game over.

### How to Play
- 👉 Click cells to toggle circle or square.
- 💀 Red means missteps.
- 🏆 Balance the grid to win!
- ✌️ Challange your friends to beat your score
            `}
          showOk={true}
          onOk={handleStartGame}
        />)}
    </Fragment>
  );
}

export default App;
