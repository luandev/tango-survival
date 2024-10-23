import React, { useState } from 'react';
import Grid from './components/Grid';
import { GameProvider } from './context/GameContext';
import { validateWholeGrid } from './validationLibrary'
import './App.css';

function App() {
  let initialSize = 4;

  const [size, setSize] = useState(initialSize);
  const [gridData, setGridData] = useState(Array.from({ length: size }, () => Array(size).fill(null)));
  const [validationData, setValidationData] = useState(Array.from({ length: size }, () => Array(size).fill(undefined)));

  const handleCellChange = (row, col) => {
    const updatedGrid = [...gridData];
    const currentState = updatedGrid[row][col];
    const newState = currentState === 'circle' ? 'square' : currentState === 'square' ? null : 'circle';
    updatedGrid[row][col] = newState;

    setGridData(updatedGrid);
    // Run validation after each cell change
    const { isGridValid, validationResults } = validateWholeGrid(gridData)
    if (isGridValid) {
      setSize(prevSize => prevSize + 3);
      setGridData(Array.from({ length: size + 1 }, () => Array(size + 1).fill(null)));
      setValidationData(Array.from({ length: size + 1 }, () => Array(size + 1).fill(undefined)));
    } else {
      setValidationData(validationResults)
    }
  }

  return (
    <GameProvider>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h1>💃 tango 💃</h1>
        <Grid
          size={size}
          gridData={gridData}
          validationData={validationData}
          onCellChange={handleCellChange}
        />
        <footer style={{ marginTop: '20px' }}>
          <p>⭐ Gimme a star on GitHub ⭐</p>
        </footer>
      </div>
    </GameProvider>
  );
}
export default App;
