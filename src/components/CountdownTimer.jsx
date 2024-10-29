import React from 'react';
import ProgressBar from './ProgressBar';
//TESTCSS import './CountdownTimer.css';

const CountdownTimer = ({ timeLeft, totalTime, isPaused }) => {
  const time = timeLeft *100 / totalTime;

  return (
    <div>
      {isPaused || timeLeft <= 0 ? null :  <ProgressBar progressPercentage={time} />}
    </div>
  );
};

export default CountdownTimer;
