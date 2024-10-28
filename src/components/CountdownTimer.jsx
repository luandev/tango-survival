import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './CountdownTimer.css';

const CountdownTimer = forwardRef(({ time, onComplete, isPaused, renderProgressBar = true }, ref) => {
    const [timeLeft, setTimeLeft] = useState(time);
    const intervalRef = useRef(null);
    const lastPlayedRef = useRef(null);
    const audio = new Audio();

    // Reset countdown whenever the `time` prop changes
    useEffect(() => {
        setTimeLeft(time);
        clearInterval(intervalRef.current);

        if (time > 0) {
            intervalRef.current = setInterval(() => {
                if(!isPaused) 
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

    // Expose getCurrentTime function to get the current time left
    useImperativeHandle(ref, () => ({
        getCurrentTime: () => timeLeft,
    }));

    const progressPercentage = (timeLeft / time) * 100;

    return (
        <div className='timer'>
            {renderProgressBar ? (
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            ) : (
                <span className={timeLeft > (time / 2) ? 'high' : timeLeft > (time / 4) ? 'med' : 'low'} >{timeLeft > 0 ? timeLeft : 0}</span>
            )}
        </div>
    );
});

export default CountdownTimer;
