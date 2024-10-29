// components/Cell.js
import React from 'react';
//TESTCSS import './Grid.css';

const Cell = ({ value, validation, onClick, groupId }) => {
  return (
    <div
      data-group={groupId}
      className={`grid-cell ${validation} ${groupId ? 'group-cell' : ''}`}
      onClick={onClick}
    >
      {value && <span className={value} />}
    </div>
  );
};

export default Cell;

