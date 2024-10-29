import React, { useState, useEffect, useRef } from 'react';
import ProgressBar from './ProgressBar';
//TESTCSS import './CountdownTimer.css';

const CountdownTimer = ({ time, onComplete, isPaused, renderProgressBar = true }, ref) => {
    const [timeLeft, setTimeLeft] = useState(time);
    const intervalRef = useRef(null);
    const lastPlayedRef = useRef(null);
    const audio = new Audio();

    function getInterpolatedColor(progressPercentage, startHSL = { h: 120, s: 100, l: 50 }, endHSL = { h: 0, s: 80, l: 40 }) {
        const interpolate = (start, end) => start + (end - start) * (progressPercentage / 100);

        const hue = interpolate(startHSL.h, endHSL.h);
        const saturation = interpolate(startHSL.s, endHSL.s);
        const lightness = interpolate(startHSL.l, endHSL.l);

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // Reset countdown whenever the `time` prop changes
    useEffect(() => {
        setTimeLeft(time);
        clearInterval(intervalRef.current);

        if (time > 0) {
            intervalRef.current = setInterval(() => {
                if (!isPaused)
                    setTimeLeft((prevTime) => prevTime - 30);
            }, 30);
        }

        return () => clearInterval(intervalRef.current);
    }, [time, isPaused]);

    // Trigger onComplete callback when timeLeft reaches 0
    useEffect(() => {
        if (timeLeft <= 0) {
            clearInterval(intervalRef.current);
            if (onComplete) onComplete();
        } else if (timeLeft % 1000 < 10 && timeLeft !== lastPlayedRef.current) { // Play audio every 1000ms
            // audio.play();
            lastPlayedRef.current = timeLeft;
        }
    }, [timeLeft, onComplete, audio]);


    const progressPercentage = (timeLeft / time) * 100;

    return (
        <div className='timer'>
            {renderProgressBar ? (
                <ProgressBar progressPercentage={progressPercentage} />
            ) : (
                <span className={timeLeft > (time / 2) ? 'high' : timeLeft > (time / 4) ? 'med' : 'low'} >{timeLeft > 0 ? timeLeft : 0}</span>
            )}
        </div>
    );
};

export default CountdownTimer;
