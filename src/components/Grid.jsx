import React, { forwardRef } from 'react';
import Cell from './Cell';
import './Grid.css';

const Grid = forwardRef(({ size, gridData, onCellChange, validateCell }, ref) => {
  return (
    <div className="grid">
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              value={cell}
              onClick={() => onCellChange(rowIndex, colIndex, cell)}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

export default Grid;
