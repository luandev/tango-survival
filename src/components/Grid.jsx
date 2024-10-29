// components/Grid.js
import React, { forwardRef } from 'react';
import Cell from './Cell';
//TESTCSS import './Grid.css';

/**
 * @param {object} props - The component's props.
 * @param {number} props.size - The width and height of the grid.
 * @param {number[][]} props.gridData - The numerical data of the grid.
 * @param {string[][]} props.validationData - The validation data for each cell (e.g., errors, warnings).
 * @param {number[][]} props.groupedCells - An array of arrays. Each inner array represents a group, and contains the indices of the cells belonging to that group. The index of a cell is calculated as rowIndex * size + colIndex, where size is the width of the grid.
 * @param {function} props.onCellChange - A callback function triggered when a cell is clicked.
 */
const Grid = forwardRef(({ size, gridData, validationData, groupedCells, onCellChange }, ref) => {

  // Create a map for faster group lookups.
  const groupedCellsMap = new Map();
  groupedCells.forEach(group => {
    group.forEach(cellIndex => {
      groupedCellsMap.set(cellIndex, group);
    });
  });

  const getCellInfo = (rowIndex, colIndex) => {
    const cellIndex = rowIndex * size + colIndex;
    const groupId = groupedCellsMap.get(cellIndex);
    const cellInfo = {
      cellIndex,
      groupId,
      validationData: validationData.length ? validationData[rowIndex][colIndex] : undefined, 
      gridData: gridData[rowIndex][colIndex], 
      groupedMembers: groupedCellsMap.get(cellIndex) || [] 
    };    

    return cellInfo;
  }

  return (
    <div className="grid">
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <Cell
              groupId={getCellInfo(rowIndex, colIndex).groupId}
              key={colIndex}
              value={cell}
              validation={validationData[rowIndex][colIndex]}
              onClick={() => onCellChange(rowIndex, colIndex, getCellInfo(rowIndex, colIndex))}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

export default Grid;
