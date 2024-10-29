// App.js
import React, { Fragment, useState, useRef, useEffect } from 'react';
import Grid from './components/Grid';
import { GameProvider } from './context/GameContext';
import CountdownTimer from './components/CountdownTimer';
import Modal from './components/Modal';
import LevelIndicator from './components/LevelIndicator';
import withGridHandling from './hoc/withGridHandling';
import { levels } from './levels';
import ParticleBackground from './components/ParticleBackground'
//TESTCSS import './App.css';

const EnhancedGrid = withGridHandling(Grid);

function App() {
  const totalLevels = levels.length;
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = levels[levelIndex];

  const [time, setTime] = useState(19000);
  const [showModal, setShowModal] = useState(true);
  const [timeLeft, setTimeLeft] = useState(time); // Initialize timeLeft here
  const [isPaused, setIsPaused] = useState(false); // Add isPaused state
  const intervalRef = useRef(null);
  const particleRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isPaused && timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 300);
      } 
      if (timeLeft <=0) {
          clearInterval(intervalRef.current);
      }
    }, 300);

    return () => clearInterval(intervalRef.current);
  }, [isPaused, timeLeft]);


  const handleStartGame = () => {
    console.log('Game started!');
    setShowModal(false);
    setIsPaused(false);
  };

  const handleComplete = () => {
    console.log('Countdown completed!');
    particleRef.current.triggerEffect();
  };

  const handleLevelUp = () => {
    if (levelIndex < totalLevels - 1) {
      setLevelIndex((prevIndex) => prevIndex + 1);
      setTime(time + 15000);
    } else {
      console.log('All levels completed!');
    }
  };

  const timeLeftPercent = 1.1-(timeLeft * 1 / time);
  return (
    <Fragment>
      <ParticleBackground ref={particleRef} maxOpacity={0.6} hecticness={timeLeftPercent} />
      <header>
        <h1>💃 tango</h1>
      </header>
      <main>
        <GameProvider>
          <div className='game-container'>
          {/* <button onClick={handleComplete}>Next Level</button> */}
            <LevelIndicator currentLevel={currentLevel.level} totalLevels={totalLevels} />
            <CountdownTimer totalTime={time} timeLeft={timeLeft}/>
            <EnhancedGrid
              onLevelUp={handleLevelUp}
              levelData={currentLevel}
            />
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
