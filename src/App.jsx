import React, { useRef, useEffect } from 'react';
import Grid from './components/Grid';
import { useGrid } from './hooks/useGrid';
import { GameProvider } from './context/GameContext';
import './App.css';

function App() {
  const gridRef = useRef(null);
  const { gridData, validationData, handleCellChange } = useGrid(4);

  return (
    <GameProvider>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h1>💃 tango 💃</h1>
        <Grid
          ref={gridRef}
          size={4}
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
