import { useState } from 'react';
import { validateGridOnCellChange } from '../validationLibrary';

export const useGrid = (size, gridRef) => {
  const [gridData, setGridData] = useState(Array.from({ length: size }, () => Array(size).fill(null)));

  const handleCellChange = (row, col, newState) => {
    const updatedGrid = [...gridData];
    updatedGrid[row][col] = newState;
    setGridData(updatedGrid);
    validateCell(updatedGrid, row, col);
  };

  const validateCell = (grid, row, col) => {
    const validationResults = validateGridOnCellChange(grid, row, col);
    const isRowComplete = !grid[row].includes(null);
    const isColumnComplete = grid.every((_, r) => grid[r][col] !== null);

    if (isRowComplete) {
      if (!validationResults.isRowValid) {
        gridRef.current.setRowInvalid(row);
      } else {
        gridRef.current.setRowValid(row);
      }
    }

    if (isColumnComplete) {
      if (!validationResults.isColumnValid) {
        gridRef.current.setColumnInvalid(col);
      } else {
        gridRef.current.setColumnValid(col);
      }
    }
  };

  return {
    gridData,
    handleCellChange,
    validateCell,
  };
};
