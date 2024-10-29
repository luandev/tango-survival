import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import PropTypes from 'prop-types';

const ParticleBackground = forwardRef(({
    particleCount = 700,
    particlePropCount = 11, // Increased to store currentSpeed
    baseTTL = 100,
    rangeTTL = 500,
    baseSpeed = 0.1,
    rangeSpeed = 1,
    baseSize = 2,
    rangeSize = 10,
    circleHue = 200, // Hue for circles
    squareHue = 0,   // Hue for squares
    backgroundColor = 'transparent',
    maxOpacity = 0.3,
    intensity = 0.5, // Intensity of the animation (0 to 1)
    easeSpeed = 0.1,
}, ref) => {
    const canvasRef = useRef(null);
    const particleProps = useRef([]);
    const tick = useRef(0);
    const center = useRef([window.innerWidth / 2, window.innerHeight / 2]);

    // Initialize currentIntensity and currentActiveParticleCount
    const [currentIntensity, setIntensity] = useState(intensity ?? 0.3);
    const currentActiveParticleCount = useRef(Math.floor(particleCount * intensity));

    // Store canvas and context refs
    const canvas = useRef({ a: null, b: null });
    const ctx = useRef({ a: null, b: null });

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        triggerExplosion,
    }));

    // Resize function
    function resize() {
        canvas.current.a.width = window.innerWidth;
        canvas.current.a.height = window.innerHeight;
        canvas.current.b.width = window.innerWidth;
        canvas.current.b.height = window.innerHeight;
        center.current = [canvas.current.a.width / 2, canvas.current.a.height / 2];
    }

    // Initialize particles
    function initParticles() {
        const particlePropsLength = particleCount * particlePropCount;
        for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            initParticle(i);
        }
    }

    // Initialize a single particle
    function initParticle(i) {
        const x = Math.random() * canvas.current.a.width;
        const y = Math.random() * canvas.current.a.height;
        const theta = Math.atan2(y - center.current[1], x - center.current[0]);
        const vx = Math.cos(theta) * 6;
        const vy = Math.sin(theta) * 6;
        const life = 0;
        const ttl = baseTTL + Math.random() * rangeTTL;
        const speed = baseSpeed + Math.random() * rangeSpeed; // Base speed
        const size = baseSize + Math.random() * rangeSize;
        const shape = Math.random() < 0.5 ? 0 : 1; // 0 for square, 1 for circle
        const hue = shape === 0 ? squareHue : circleHue; // Assign hue based on shape
        const currentSpeed = speed * currentIntensity; // Initialize current speed

        const index = i;
        particleProps.current[index] = x;
        particleProps.current[index + 1] = y;
        particleProps.current[index + 2] = vx;
        particleProps.current[index + 3] = vy;
        particleProps.current[index + 4] = life;
        particleProps.current[index + 5] = ttl;
        particleProps.current[index + 6] = speed;
        particleProps.current[index + 7] = size;
        particleProps.current[index + 8] = hue;
        particleProps.current[index + 9] = shape;
        particleProps.current[index + 10] = currentSpeed;
    }

    // Draw particles
    function drawParticles() {
        const particlesToDraw = Math.floor(currentActiveParticleCount.current);
        for (let i = 0; i < particlesToDraw * particlePropCount; i += particlePropCount) {
            updateParticle(i);
        }
    }

    // Update a single particle
    function updateParticle(i) {
        let x = particleProps.current[i];
        let y = particleProps.current[i + 1];
        let life = particleProps.current[i + 4] + 1;
        const ttl = particleProps.current[i + 5];
        const baseSpeed = particleProps.current[i + 6];
        const size = particleProps.current[i + 7];
        const hue = particleProps.current[i + 8];
        const shape = particleProps.current[i + 9];
        let currentSpeed = particleProps.current[i + 10];

        const theta = Math.atan2(y - center.current[1], x - center.current[0]) + 0.75 * Math.PI / 2;
        const vx = 0.95 * particleProps.current[i + 2] + 0.05 * Math.cos(theta) * 2;
        const vy = 0.95 * particleProps.current[i + 3] + 0.05 * Math.sin(theta) * 2;

        // Desired speed based on currentIntensity
        const desiredSpeed = baseSpeed * currentIntensity;

        // Adjust currentSpeed towards desiredSpeed
        currentSpeed += (desiredSpeed - currentSpeed) * 0.05;

        // Save currentSpeed
        particleProps.current[i + 10] = currentSpeed;

        const x2 = x + vx * currentSpeed;
        const y2 = y + vy * currentSpeed;

        const ctxa = ctx.current.a;
        ctxa.save();
        ctxa.lineCap = 'round';
        ctxa.lineWidth = 1;
        const currentOpacity = Math.min(fadeInOut(life, ttl), maxOpacity);
        ctxa.strokeStyle = `hsla(${hue},100%,60%,${currentOpacity})`;
        ctxa.beginPath();

        if (shape === 0) {
            // Draw Square Outline
            ctxa.strokeRect(x2 - size / 2, y2 - size / 2, size, size);
        } else {
            // Draw Circle Outline
            ctxa.arc(x2, y2, size / 2, 0, Math.PI * 2);
            ctxa.stroke();
        }

        ctxa.closePath();
        ctxa.restore();

        // Update particle properties
        particleProps.current[i] = x2;
        particleProps.current[i + 1] = y2;
        particleProps.current[i + 2] = vx;
        particleProps.current[i + 3] = vy;
        particleProps.current[i + 4] = life;

        // Reinitialize particle if its life exceeds TTL
        if (life > ttl) initParticle(i);
    }

    // Fade in/out function
    function fadeInOut(life, ttl) {
        const halfTTL = ttl / 2;
        return life < halfTTL ? life / halfTTL : 1 - (life - halfTTL) / halfTTL;
    }

    // Main draw function
    function draw() {
        tick.current++;

        // Easing currentIntensity towards intensity
        setIntensity((intensity - currentIntensity) * easeSpeed);

        // Adjust currentActiveParticleCount
        const desiredActiveParticleCount = particleCount * currentIntensity;
        currentActiveParticleCount.current += (desiredActiveParticleCount - currentActiveParticleCount.current) * 0.05;

        const ctxa = ctx.current.a;
        const ctxb = ctx.current.b;
        const canvasa = canvas.current.a;
        const canvasb = canvas.current.b;

        ctxa.clearRect(0, 0, canvasa.width, canvasa.height);
        ctxb.clearRect(0, 0, canvasb.width, canvasb.height);

        drawParticles();
        renderGlow();
        render();

        requestAnimationFrame(draw);
    }

    // Render glow effect
    function renderGlow() {
        const ctxb = ctx.current.b;
        const canvasa = canvas.current.a;

        ctxb.save();
        ctxb.filter = 'blur(8px) brightness(200%)';
        ctxb.globalCompositeOperation = 'lighter';
        ctxb.drawImage(canvasa, 0, 0);
        ctxb.restore();

        ctxb.save();
        ctxb.filter = 'blur(4px) brightness(200%)';
        ctxb.globalCompositeOperation = 'lighter';
        ctxb.drawImage(canvasa, 0, 0);
        ctxb.restore();
    }

    // Render final frame
    function render() {
        const ctxb = ctx.current.b;
        const canvasa = canvas.current.a;

        ctxb.save();
        ctxb.globalCompositeOperation = 'lighter';
        ctxb.drawImage(canvasa, 0, 0);
        ctxb.restore();
    }

    // Trigger explosion effect
    function triggerExplosion() {
        // Loop through particles and set velocities to make them shoot outwards
        for (let i = 0; i < particleProps.current.length; i += particlePropCount) {
            const x = particleProps.current[i];
            const y = particleProps.current[i + 1];
            const angle = Math.atan2(y - center.current[1], x - center.current[0]);
            const speed = (2 + Math.random() * 4) * currentIntensity; // Adjust speed

            particleProps.current[i + 2] = Math.cos(angle) * speed;
            particleProps.current[i + 3] = Math.sin(angle) * speed;
            particleProps.current[i + 4] = 0; // Reset life
        }
    }

    useEffect(() => {
        setIntensity(intensity);
    }, [
        // Remove intensity from dependencies to prevent re-initialization
        intensity,
    ]);

    useEffect(() => {
        // Initialize canvas and contexts
        canvas.current.a = document.createElement('canvas');
        canvas.current.b = canvasRef.current;
        ctx.current.a = canvas.current.a.getContext('2d');
        ctx.current.b = canvas.current.b.getContext('2d');

        window.addEventListener('resize', resize);
        resize();
        initParticles();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, [
        // Remove intensity from dependencies to prevent re-initialization
        particleCount,
        particlePropCount,
        baseTTL,
        rangeTTL,
        baseSpeed,
        rangeSpeed,
        baseSize,
        rangeSize,
        circleHue,
        squareHue,
        backgroundColor,
        maxOpacity,
    ]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
            }}
        />
    );
});

ParticleBackground.propTypes = {
    particleCount: PropTypes.number,
    particlePropCount: PropTypes.number,
    baseTTL: PropTypes.number,
    rangeTTL: PropTypes.number,
    baseSpeed: PropTypes.number,
    rangeSpeed: PropTypes.number,
    baseSize: PropTypes.number,
    rangeSize: PropTypes.number,
    circleHue: PropTypes.number, // Hue for circles
    squareHue: PropTypes.number, // Hue for squares
    backgroundColor: PropTypes.string,
    maxOpacity: PropTypes.number,
    intensity: PropTypes.number, // Intensity of the animation (0 to 1)
};

export default ParticleBackground;
