import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ParticleBackground = ({
    particleCount = 700,
    particlePropCount = 10, // Increased from 9 to 10 to accommodate shape
    baseTTL = 100,
    rangeTTL = 500,
    baseSpeed = 0.1,
    rangeSpeed = 100,
    baseSize = 2,
    rangeSize = 10,
    baseHue = 10,
    rangeHue = 100,
    backgroundColor = 'transparent', // Set to transparent
    maxOpacity = 1 // New prop to control maximum opacity
} = {}) => {
    const particlePropsLength = particleCount * particlePropCount;

    const canvasRef = useRef(null);
    const particleProps = useRef(new Float32Array(particlePropsLength)).current;
    const tick = useRef(0);
    const center = useRef([window.innerWidth / 2, window.innerHeight / 2]);

    useEffect(() => {
        const canvas = {
            a: document.createElement('canvas'),
            b: canvasRef.current
        };
        const ctx = {
            a: canvas.a.getContext('2d'),
            b: canvas.b.getContext('2d')
        };

        function resize() {
            canvas.a.width = window.innerWidth;
            canvas.a.height = window.innerHeight;
            canvas.b.width = window.innerWidth;
            canvas.b.height = window.innerHeight;
            center.current = [canvas.a.width / 2, canvas.a.height / 2];
        }

        function initParticles() {
            for (let i = 0; i < particlePropsLength; i += particlePropCount) {
                initParticle(i);
            }
        }

        function initParticle(i) {
            const x = Math.random() * canvas.a.width;
            const y = Math.random() * canvas.a.height;
            const theta = Math.atan2(y - center.current[1], x - center.current[0]);
            const vx = Math.cos(theta) * 6;
            const vy = Math.sin(theta) * 6;
            const life = 0;
            const ttl = baseTTL + Math.random() * rangeTTL;
            const speed = baseSpeed + Math.random() * rangeSpeed;
            const size = baseSize + Math.random() * rangeSize;
            const hue = baseHue + Math.random() * rangeHue;
            const shape = Math.random() < 0.5 ? 0 : 1; // 0 for square, 1 for circle

            particleProps.set([x, y, vx, vy, life, ttl, speed, size, hue, shape], i);
        }

        function drawParticles() {
            for (let i = 0; i < particlePropsLength; i += particlePropCount) {
                updateParticle(i);
            }
        }

        function updateParticle(i) {
            let x = particleProps[i];
            let y = particleProps[i + 1];
            let life = particleProps[i + 4] + 1;
            const ttl = particleProps[i + 5];
            const speed = particleProps[i + 6];
            const size = particleProps[i + 7];
            const hue = particleProps[i + 8];
            const shape = particleProps[i + 9];

            const theta = Math.atan2(y - center.current[1], x - center.current[0]) + 0.75 * Math.PI / 2;
            const vx = 0.95 * particleProps[i + 2] + 0.05 * Math.cos(theta) * 2;
            const vy = 0.95 * particleProps[i + 3] + 0.05 * Math.sin(theta) * 2;

            const x2 = x + vx * speed;
            const y2 = y + vy * speed;

            ctx.a.save();
            ctx.a.lineCap = 'round';
            ctx.a.lineWidth = 1;
            // Ensure opacity does not exceed maxOpacity
            const currentOpacity = Math.min(fadeInOut(life, ttl), maxOpacity);
            ctx.a.strokeStyle = `hsla(${hue},100%,60%,${currentOpacity})`;
            ctx.a.beginPath();

            if (shape === 0) {
                // Draw Square Outline
                ctx.a.strokeRect(x2 - size / 2, y2 - size / 2, size, size);
            } else {
                // Draw Circle Outline
                ctx.a.arc(x2, y2, size / 2, 0, Math.PI * 2);
                ctx.a.stroke();
            }

            ctx.a.closePath();
            ctx.a.restore();

            // Update particle properties
            particleProps[i] = x2;
            particleProps[i + 1] = y2;
            particleProps[i + 2] = vx;
            particleProps[i + 3] = vy;
            particleProps[i + 4] = life;

            // Reinitialize particle if its life exceeds TTL
            if (life > ttl) initParticle(i);
        }

        function fadeInOut(life, ttl) {
            const halfTTL = ttl / 2;
            return life < halfTTL ? life / halfTTL : 1 - (life - halfTTL) / halfTTL;
        }

        function draw() {
            tick.current++;
            ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
            ctx.b.clearRect(0, 0, canvas.b.width, canvas.b.height); // Ensure transparency

            drawParticles();
            renderGlow();
            render();

            requestAnimationFrame(draw);
        }

        function renderGlow() {
            ctx.b.save();
            ctx.b.filter = 'blur(8px) brightness(200%)';
            ctx.b.globalCompositeOperation = 'lighter';
            ctx.b.drawImage(canvas.a, 0, 0);
            ctx.b.restore();

            ctx.b.save();
            ctx.b.filter = 'blur(4px) brightness(200%)';
            ctx.b.globalCompositeOperation = 'lighter';
            ctx.b.drawImage(canvas.a, 0, 0);
            ctx.b.restore();
        }

        function render() {
            ctx.b.save();
            ctx.b.globalCompositeOperation = 'lighter';
            ctx.b.drawImage(canvas.a, 0, 0);
            ctx.b.restore();
        }

        window.addEventListener('resize', resize);
        resize();
        initParticles();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, [
        particleCount,
        particlePropCount,
        baseTTL,
        rangeTTL,
        baseSpeed,
        rangeSpeed,
        baseSize,
        rangeSize,
        baseHue,
        rangeHue,
        backgroundColor,
        maxOpacity // Added to dependency array
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
                pointerEvents: 'none', // Prevent canvas from capturing mouse events
            }}
        />
    );
};

// Define PropTypes for better type checking and documentation
ParticleBackground.propTypes = {
    particleCount: PropTypes.number,
    particlePropCount: PropTypes.number,
    baseTTL: PropTypes.number,
    rangeTTL: PropTypes.number,
    baseSpeed: PropTypes.number,
    rangeSpeed: PropTypes.number,
    baseSize: PropTypes.number,
    rangeSize: PropTypes.number,
    baseHue: PropTypes.number,
    rangeHue: PropTypes.number,
    backgroundColor: PropTypes.string,
    maxOpacity: PropTypes.number, // New prop type
};

export default ParticleBackground;
