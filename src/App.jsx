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

- **Fill the Grid:** Place circles and squares to complete each row and column.
- **Balance Each Row and Column:** Keep an equal mix of shapes, like binary sudoku.
- **Avoid Clusters:** No more than two of the same shape side-by-side.
- **Purple Groups Move Together:** Plan ahead; changing one changes all.
- **Beat the Clock:** Complete the grid before time runs out!

**Good luck, and let the Tango begin!** 💃

                `}</ReactMarkdown>
                <div style={{
                  flexDirection: 'row',
                  display: 'flex',
                  rowGap: '20px',
                  width: '100%',
                  justifyContent: 'space-evenly',
                }}>
                  <div style={{
                    flexDirection: 'column',
                    width: '200px',
                  }}>
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
                  </div>

                  <button onClick={handleStartGame}>Start Game</button>
                </div>

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
    </Fragment>
  );
}

export default App;
