import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './CountdownTimer.css';


const CountdownTimer = forwardRef(({ time, onComplete, audioSrc }, ref) => {
    const [timeLeft, setTimeLeft] = useState(time);
    const intervalRef = useRef(null);
    const lastPlayedRef = useRef(null);
    const audio = new Audio(audioSrc);

    // Reset countdown whenever the `time` prop changes
    useEffect(() => {
        setTimeLeft(time);
        clearInterval(intervalRef.current);

        if (time > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 10);
            }, 10);
        }

        return () => clearInterval(intervalRef.current);
    }, [time]);

    // Trigger onComplete callback when timeLeft reaches 0
    useEffect(() => {
        if (timeLeft <= 0) {
            clearInterval(intervalRef.current);
            if (onComplete) onComplete();
        } else if (timeLeft % 1000 < 10 && timeLeft !== lastPlayedRef.current) { // Play audio every 1000ms
            audio.play();
            lastPlayedRef.current = timeLeft;
        }
    }, [timeLeft, onComplete, audio]);

    // Expose getCurrentTime function to get the current time left
    useImperativeHandle(ref, () => ({
        getCurrentTime: () => timeLeft,
    }));

    return (
        <div className='timer'>
            <span className={timeLeft > (time / 2) ? 'high' : timeLeft > (time / 4) ? 'med' : 'low'} >{timeLeft > 0 ? timeLeft : 0}</span>
        </div>
    );
});

export default CountdownTimer;
