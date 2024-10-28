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
- No more than 2 consecutive shapes in a row or column. It’s called “Tango” because you need to keep the balance – no over-clustering!
- Equal number of shapes in each row and column. It’s all about that balance. Think of it like keeping your dance partner on their toes!
- Complete the grid and achieve perfect balance to win the game. ⚖️

### How to Play
- 🖱️ Click on a Cell: Toggle between circle, square, or empty. Find that perfect configuration!
- ⚠️ Watch for Warnings: Rows or columns turning a sad, invalid red? Time to re-evaluate your choices!
- 🏆 Win by Filling the Grid Correctly: Achieve balance and harmony across the grid to master the tan
            `}
          showOk={true}
          onOk={handleStartGame}
        />)}
    </Fragment>
  );
}

export default App;
