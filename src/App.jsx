// App.js
import React, { Fragment, useState, useRef, useEffect, useMemo } from 'react';
import Grid from './components/Grid';
import { GameProvider } from './context/GameContext';
import CountdownTimer from './components/CountdownTimer';
import ReactMarkdown from 'react-markdown';
import LevelIndicator from './components/LevelIndicator';
import withGridHandling from './hoc/withGridHandling';
import { generateLevels } from './generateGrid.js';
import ParticleBackground from './components/ParticleBackground';
// TESTCSS import './App.css';

const EnhancedGrid = withGridHandling(Grid);



function App() {
  const totalLevels = 10;

  // Game state: 'lobby', 'game-start', 'game-over'
  const [gameState, setGameState] = useState('lobby');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Beginner'); 
  const [levels, setLevels] = useState([]); 

  const [levelIndex, setLevelIndex] = useState(0);
  const baseTime = 60000; // 60 seconds
  const [timeLeft, setTimeLeft] = useState(baseTime);
  const intervalRef = useRef(null);
  const particleRef = useRef();

  

  // Timer Effect
  useEffect(() => {
    if (gameState !== 'game-start') return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 300) {
          return prevTime - 300;
        } else {
          clearInterval(intervalRef.current);
          handleComplete();
          return 0;
        }
      });
    }, 300);

    return () => clearInterval(intervalRef.current);
  }, [gameState]);

  // Handle Countdown Completion
  const handleComplete = () => {
    console.log('Countdown completed!');
    if (particleRef.current) {
      particleRef.current.triggerEffect();
    }
    setGameState('game-over');
  };

  // Handle Level Up
  const handleLevelUp = () => {
    if (levelIndex < totalLevels - 1) {
      setLevelIndex((prevIndex) => prevIndex + 1);
      setTimeLeft((prevTime) => (prevTime + 15000 > baseTime ? baseTime : prevTime + 15000));
    } else {
      console.log('All levels completed!');
      setGameState('game-over');
    }
  };

  // Start Game
  const handleStartGame = () => {
    const levels = generateLevels(totalLevels, selectedDifficulty);
    setLevels(levels);
    setLevelIndex(0);
    setTimeLeft(baseTime);
    setGameState('game-start');
  };

  // Restart Game
  const handleRestart = () => {
    setGameState('lobby');
    setLevelIndex(0);
    setTimeLeft(baseTime);
  };

  const timeLeftPercent = 1.1 - (timeLeft * 1) / baseTime;

  return (
    <Fragment>
      <ParticleBackground ref={particleRef} maxOpacity={0.3} hecticness={timeLeftPercent} />
      <header>
        <h1>💃 tango</h1>
      </header>
      <main>
        <GameProvider>
          <div className='game-container'>
            {gameState === 'lobby' && (
              <div className='modal-content'>

                


                <ReactMarkdown className="modal-message">{`
## Welcome to Tango!

1. Fill rows and columns to find a perfect balance.
2. Spread shapes evenly across the grid, avoid 3 of same kind.
3. Run out of time? Game over.

                `}</ReactMarkdown>
                <input 
                  type="range" 
                  min="0" 
                  max="4" 
                  value={['Beginner', 'Amateur', 'Intermediate', 'Advanced', 'Grandmaster'].indexOf(selectedDifficulty)} 
                  onChange={(e) => {
                    const difficultyLevels = ['Beginner', 'Amateur', 'Intermediate', 'Advanced', 'Grandmaster'];
                    setSelectedDifficulty(difficultyLevels[e.target.value]);
                  }}
                  className="difficulty-slider"
                />
                <div className="difficulty-label">{selectedDifficulty}</div>
                <button onClick={handleStartGame}>Start Game</button>

              </div>
            )}

            {gameState === 'game-start' && (
              <>
                <CountdownTimer totalTime={baseTime} timeLeft={timeLeft} />
                <EnhancedGrid onLevelUp={handleLevelUp} levelData={levels[levelIndex]} />
                <LevelIndicator currentLevel={levelIndex + 1} totalLevels={totalLevels} />
              </>
            )}

            {gameState === 'game-over' && (
              <div className='game-over'>
                <h2>Game Over!</h2>
                <p>Your final level: {levelIndex + 1}</p>
                <button onClick={handleRestart}>Restart Game</button>
              </div>
            )}
          </div>
        </GameProvider>
      </main>
      <footer>
        <p>
          Gimme feedback and a ⭐ on <a href="https://github.com/luandev/tango-survival">GitHub</a>!
        </p>
      </footer>
      {/* 
      {showModal && (
        <Modal
          message={`
## Welcome to Tango!  
### Rules
- Max 2 repeated shapes
- Rows and columns must match, like sudoku
- Run out of time? Game over.

### How to Play
- 👉 Click cells to toggle circle or square.
- 💀 Red means missteps.
- 🏆 Balance the grid to win!
- ✌️ Challenge your friends to beat your score
          `}
          showOk={true}
          onOk={handleStartGame}
        />
      )} 
      */}
    </Fragment>
  );
}

export default App;
