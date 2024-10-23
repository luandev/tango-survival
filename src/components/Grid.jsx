// components/Grid.js
import React, { forwardRef } from 'react';
import Cell from './Cell';
import './Grid.css';

const Grid = forwardRef(({ size, gridData, validationData, onCellChange }, ref) => {
  return (
    <div className="grid">
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              value={cell}
              validation={validationData[rowIndex][colIndex]}
              onClick={() => onCellChange(rowIndex, colIndex, cell)}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

export default Grid;
