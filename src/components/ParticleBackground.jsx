import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const ParticleBackground = forwardRef(({
    particleCount = 700,
    particlePropCount = 10,
    baseTTL = 100,
    rangeTTL = 500,
    baseSpeed = 0.1,
    rangeSpeed = 1,
    baseSize = 2,
    rangeSize = 10,
    circleHue = 0, // Hue for circles
    squareHue = 200,   // Hue for squares
    backgroundColor = 'transparent',
    maxOpacity = 1,
    intensity = 0.1, // Intensity of the animation (0 to 1)
}, ref) => {
    const canvasRef = useRef(null);
    const particleProps = useRef([]);
    const tick = useRef(0);
    const center = useRef([window.innerWidth / 2, window.innerHeight / 2]);
    const [activeParticleCount, setActiveParticleCount] = React.useState(Math.floor(particleCount * intensity));

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        triggerExplosion,
    }));

    useEffect(() => {
        const canvas = {
            a: document.createElement('canvas'),
            b: canvasRef.current
        };
        const ctx = {
            a: canvas.a.getContext('2d'),
            b: canvas.b.getContext('2d')
        };

        // Initialize particle properties array
        const particlePropsLength = particleCount * particlePropCount;
        particleProps.current = new Float32Array(particlePropsLength);

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
            const speed = (baseSpeed + Math.random() * rangeSpeed) * intensity; // Adjust speed based on intensity
            const size = baseSize + Math.random() * rangeSize;
            const shape = Math.random() < 0.5 ? 0 : 1; // 0 for square, 1 for circle
            const hue = shape === 0 ? squareHue : circleHue; // Assign hue based on shape

            particleProps.current.set([x, y, vx, vy, life, ttl, speed, size, hue, shape], i);
        }

        function drawParticles() {
            for (let i = 0; i < activeParticleCount * particlePropCount; i += particlePropCount) {
                updateParticle(i);
            }
        }

        function updateParticle(i) {
            let x = particleProps.current[i];
            let y = particleProps.current[i + 1];
            let life = particleProps.current[i + 4] + 1;
            const ttl = particleProps.current[i + 5];
            const speed = particleProps.current[i + 6];
            const size = particleProps.current[i + 7];
            const hue = particleProps.current[i + 8];
            const shape = particleProps.current[i + 9];

            const theta = Math.atan2(y - center.current[1], x - center.current[0]) + 0.75 * Math.PI / 2;
            const vx = 0.95 * particleProps.current[i + 2] + 0.05 * Math.cos(theta) * 2;
            const vy = 0.95 * particleProps.current[i + 3] + 0.05 * Math.sin(theta) * 2;

            const x2 = x + vx * speed;
            const y2 = y + vy * speed;

            ctx.a.save();
            ctx.a.lineCap = 'round';
            ctx.a.lineWidth = 1;
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
            particleProps.current[i] = x2;
            particleProps.current[i + 1] = y2;
            particleProps.current[i + 2] = vx;
            particleProps.current[i + 3] = vy;
            particleProps.current[i + 4] = life;

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
            ctx.b.clearRect(0, 0, canvas.b.width, canvas.b.height);

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

        function triggerExplosion() {
            // Loop through particles and set velocities to make them shoot outwards
            for (let i = 0; i < particleProps.current.length; i += particlePropCount) {
                const x = particleProps.current[i];
                const y = particleProps.current[i + 1];
                const angle = Math.atan2(y - center.current[1], x - center.current[0]);
                const speed = (2 + Math.random() * 4) * intensity; // Adjust speed

                particleProps.current[i + 2] = Math.cos(angle) * speed;
                particleProps.current[i + 3] = Math.sin(angle) * speed;
                particleProps.current[i + 4] = 0; // Reset life
            }
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
        circleHue,
        squareHue,
        backgroundColor,
        maxOpacity,
        intensity,
    ]);

    // Update activeParticleCount when intensity changes
    useEffect(() => {
        setActiveParticleCount(Math.floor(particleCount * intensity));
    }, [intensity, particleCount]);

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
