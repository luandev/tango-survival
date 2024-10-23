// hooks/useGrid.js
import { useState } from 'react';
import { validateGridOnCellChange } from '../validationLibrary';

export const useGrid = (size) => {
  const [gridData, setGridData] = useState(Array.from({ length: size }, () => Array(size).fill(null)));
  const [validationData, setValidationData] = useState(Array.from({ length: size }, () => Array(size).fill(undefined)));

  const handleCellChange = (row, col) => {
    const updatedGrid = [...gridData];
    const currentState = updatedGrid[row][col];
    const newState = currentState === 'circle' ? 'square' : currentState === 'square' ? null : 'circle';
    updatedGrid[row][col] = newState;

    setGridData(updatedGrid);
    // Run validation after each cell change
    const validationResults = validateGridOnCellChange(updatedGrid, row, col);
    const isRowComplete = !updatedGrid[row].includes(null);
    const isColumnComplete = updatedGrid.every((_, r) => updatedGrid[r][col] !== null);

    const updatedValidation = [...validationData];

    if (isRowComplete) {
      updatedValidation[row] = updatedValidation[row].map(() => validationResults.isRowValid ? 'valid' : 'invalid');
    }

    if (isColumnComplete) {
      for (let i = 0; i < size; i++) {
        updatedValidation[i][col] = validationResults.isColumnValid ? 'valid' : 'invalid';
      }
    }

    setValidationData(updatedValidation);
  };


  return {
    gridData,
    validationData,
    handleCellChange,
  };
};
