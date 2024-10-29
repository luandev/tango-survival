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

    const handleCellChange = (row, col, cellData) => {
      // Calculate the index of the clicked cell
      const currentIndex = cellData.cellIndex;
    
      // Find the group that includes the clicked cell's index
      const group = currentLevelData.groupedCells.find(group => group.includes(cellData.cellIndex));
    
      // Determine which indices need to be toggled
      const indicesToToggle = group ? group : [currentIndex];
      
      // Create a Set for efficient lookup
      const toggleSet = new Set(indicesToToggle);
    
      // Create a new grid with updated cell states
      const updatedGrid = currentLevelData.gridData.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) => {
          const index = rowIndex * currentLevelData.size + colIndex;
          if (toggleSet.has(index)) {
            // Toggle the state of the cell
            return toggleCellState(cell);
          }
          // Return the cell as is if it's not in the toggle set
          return cell;
        })
      );
    
      // Validate the updated grid
      const { isGridValid, validationResults } = validateWholeGrid(updatedGrid);

      setCurrentLevelData(prevData => ({
        ...prevData,
        gridData: updatedGrid,
        validationData: validationResults,
      }));
    
      if (isGridValid) {
        proceedToNextLevel();
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
          groupedCells={currentLevelData.groupedCells}
          onCellChange={handleCellChange}
        />
      );
  };
};

export default withGridHandling;
