import React, { useState, useEffect } from 'react';
import { validateWholeGrid } from '../validationLibrary';

/**
 * Higher-Order Component for handling grid data, validation, and delegating level progression.
 *
 * @param {React.Component} WrappedComponent - The component to wrap.
 * @returns {React.Component} - A wrapped component with grid handling functionality.
 */
const withGridHandling = (WrappedComponent) => {
  return ({ onLevelUp, levelData, ...props }) => {
    const [currentLevelData, setCurrentLevelData] = useState(() => ({
      ...levelData,
      validationData: Array.from({ length: levelData.size }, () => Array(levelData.size).fill(undefined)),
    }));

    // Update `currentLevelData` when `levelData` changes
    useEffect(() => {
      setCurrentLevelData({
        ...levelData,
        validationData: Array.from({ length: levelData.size }, () => Array(levelData.size).fill(undefined)),
      });
    }, [levelData.level]);

    const handleCellChange = (row, col) => {
      const updatedGrid = currentLevelData.gridData.map((rowArr, rowIndex) =>
        rowIndex === row
          ? rowArr.map((cell, colIndex) => (colIndex === col ? toggleCellState(cell) : cell))
          : rowArr
      );

      const { isGridValid, validationResults } = validateWholeGrid(updatedGrid);

      if (isGridValid) {
        proceedToNextLevel();
      } else {
        setCurrentLevelData((prevData) => ({
          ...prevData,
          gridData: updatedGrid,
          validationData: validationResults,
        }));
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
          size={currentLevelData.size}
          gridData={currentLevelData.gridData}
          validationData={currentLevelData.validationData}
          onCellChange={handleCellChange}
        />
      );
  };
};

export default withGridHandling;
