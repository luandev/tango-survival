import React from 'react';
import ProgressBar from './ProgressBar';
//TESTCSS import './CountdownTimer.css';

const CountdownTimer = ({ timeLeft, totalTime, isPaused }) => {
  const time = timeLeft *100 / totalTime;

  return <ProgressBar progressPercentage={time} />;
};

export default CountdownTimer;
