import React from 'react';
import './LevelIndicator.css';

const LevelIndicator = ({ currentLevel, totalLevels }) => {
  return (
    <div className="level-indicator">
      {Array.from({ length: totalLevels }).map((_, index) => {
        const isHighlighted = index >= currentLevel - 2 && index <= currentLevel;
        return (
          <div
            key={index}
            className={`level-circle ${isHighlighted ? 'highlighted' : ''}`}
          />
        );
      })}
    </div>
  );
};

export default LevelIndicator;
