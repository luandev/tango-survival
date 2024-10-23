// components/Cell.js
import React from 'react';
import './Grid.css';

const Cell = ({ value, validation, onClick }) => {
  return (
    <div
      className={`grid-cell ${value} ${validation}`}
      onClick={onClick}
    >
      {value && <span className={value} />}
    </div>
  );
};

export default Cell;
