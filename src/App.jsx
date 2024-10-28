import React, { Fragment, useState } from 'react';
import Grid from './components/Grid';
import { GameProvider } from './context/GameContext';
import CountdownTimer from './components/CountdownTimer'
import Modal from './components/Modal'
import { validateWholeGrid } from './validationLibrary'

import './App.css';

function App() {
  let initialSize = 4;

  const [size, setSize] = useState(initialSize);
  const [gridData, setGridData] = useState(Array.from({ length: size }, () => Array(size).fill(null)));
  const [validationData, setValidationData] = useState(Array.from({ length: size }, () => Array(size).fill(undefined)));
  const [time, setTime] = useState(15000); // Start with 5 seconds
  const [showModal, setShowModal] = useState(true);

  const handleStartGame = () => {
    console.log('Game started!');
    setShowModal(false); // Dismiss the modal
  };

  const handleComplete = () => {
    console.log('Countdown completed!');
  };

  const addMoreTime = () => {
    setTime((prevTime) => prevTime + 2000); // Adds 2 seconds to the countdown
  };

  const handleCellChange = (row, col) => {
    const updatedGrid = [...gridData];
    const currentState = updatedGrid[row][col];
    const newState = currentState === 'circle' ? 'square' : 'circle';
    updatedGrid[row][col] = newState;

    setGridData(updatedGrid);
    // Run validation after each cell change
    const { isGridValid, validationResults } = validateWholeGrid(gridData)
    if (isGridValid) {
      const newSize = size % 2 === 0 ? size + 2 : size + 1;
      setSize(newSize);
      setGridData(Array.from({ length: newSize }, () => Array(newSize).fill(null)));
      setValidationData(Array.from({ length: newSize }, () => Array(newSize).fill(undefined)));
    } else {
      setValidationData(validationResults)
    }
  }

  return (
    <Fragment>
      <header>
        <h1 >💃 tango 💃</h1>
      </header>
      <GameProvider>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <CountdownTimer time={time} onComplete={handleComplete} isPaused={showModal} />
          <Grid
            size={size}
            gridData={gridData}
            validationData={validationData}
            onCellChange={handleCellChange}
          />
        </div>
      </GameProvider>
      <footer style={{ marginTop: '20px' }}>
        <p>⭐ Gimme a star on GitHub ⭐</p>
      </footer>
      {showModal && (
        <Modal 
          message="Are you ready to start the game?" 
          showOk={true}
          showCancel={false} // Only show OK button
          onOk={handleStartGame}
        />
      )}
    </Fragment>
  );
}
export default App;
