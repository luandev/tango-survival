import React from 'react';
//TESTCSS import './LevelIndicator.css';

const LevelIndicator = ({ currentLevel, totalLevels }) => {
  return (
    <div className="level-indicator">
      {Array.from({ length: totalLevels }).map((_, index) => {
        const isCurrentLevel = index == currentLevel -1;
        const isCompleted = index < currentLevel -1;
        return (
          <div
            key={index}
            className={`level-circle ${isCompleted ? 'done' : ''} ${isCurrentLevel ? 'highlighted' : ''}`}
          />
        );
      })}
    </div>
  );
};

export default LevelIndicator;
