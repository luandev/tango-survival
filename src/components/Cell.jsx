// components/Cell.js
import React from 'react';
//TESTCSS import './Grid.css';

const Cell = ({ value, validation, onClick, groupId }) => {
  const hasValidation = validation !== undefined;
  const hasGroup = groupId !== undefined;

  const cell = (
    <div
      data-group={groupId}
      className={`grid-cell ${hasValidation ? validation : ''} ${hasGroup ? 'group-cell' : ''}`}
      onClick={onClick}
    >
      {value && <span className={value} />}
    </div>
  )

  return hasGroup ? (
    <div className="group-cell-container">
      {cell}
    </div>
  ) : cell
};

export default Cell;

