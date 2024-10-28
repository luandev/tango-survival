import React, { useState } from 'react';
import { validateWholeGrid } from '../validationLibrary';

/**
 * Higher-Order Component for handling grid data, validation, and delegating level progression.
 *
 * @param {React.Component} WrappedComponent - The component to wrap.
 * @param {Object} options - Options containing initial grid data and size.
 * @param {Array<Array<string|null>>} options.gridData - Initial grid data.
 * @param {number} options.size - Initial grid size.
 * @returns {React.Component} - A wrapped component with grid handling functionality.
 */
const withGridHandling = (WrappedComponent, { gridData = [], size = 4 } = {}) => {
  return ({ onLevelUp, ...props }) => {
    const [validationData, setValidationData] = useState(
      Array.from({ length: size }, () => Array(size).fill(undefined))
    );
    const [currentGridData, setCurrentGridData] = useState(gridData);

    const handleCellChange = (row, col) => {
      const updatedGrid = currentGridData.map((rowArr, rowIndex) =>
        rowIndex === row
          ? rowArr.map((cell, colIndex) => (colIndex === col ? toggleCellState(cell) : cell))
          : rowArr
      );

      setCurrentGridData(updatedGrid);

      const { isGridValid, validationResults } = validateWholeGrid(updatedGrid);

      if (isGridValid) {
        proceedToNextLevel();
      } else {
        setValidationData(validationResults);
      }
    };

    const toggleCellState = (cell) => (cell === 'circle' ? 'square' : 'circle');

    const proceedToNextLevel = () => {
      if (typeof onLevelUp === 'function') {
        onLevelUp();
      } else {
        console.warn("onLevelUp callback is not provided or isn't a function.");
      }
    };

    return (
      <WrappedComponent
        {...props}
        size={size}
        gridData={currentGridData}
        validationData={validationData}
        onCellChange={handleCellChange}
      />
    );
  };
};

export default withGridHandling;
