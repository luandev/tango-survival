import React from 'react';
import './Grid.css';

const Cell = ({ value, onClick }) => {
  return (
    <div
      className={`grid-cell ${value}`}
      onClick={onClick}
    >
      {value && <span className={value} />}
    </div>
  );
};

export default Cell;
