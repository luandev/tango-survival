// components/Cell.js
import React from 'react';
import './Grid.css';

const Cell = ({ value, validation, onClick }) => {
  return (
    <div
      className={`grid-cell ${validation}`}
      onClick={onClick}
    >
      {value && <span className={value} />}
    </div>
  );
};

export default Cell;

