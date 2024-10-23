import React, { useRef } from 'react';
import Grid from './components/Grid';
import { useGrid } from './hooks/useGrid';
import { GameProvider } from './context/GameContext';
import './App.css';

function App() {
  const gridRef = useRef();
  const { gridData, handleCellChange, validateCell } = useGrid(4, gridRef);

  return (
    <GameProvider>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h1>💃 tango 💃</h1>
        <Grid
          ref={gridRef}
          size={4}
          gridData={gridData}
          onCellChange={handleCellChange}
          validateCell={validateCell}
        />
        <footer style={{ marginTop: '20px' }}>
          <p>⭐ Gimme a star on GitHub ⭐</p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;
