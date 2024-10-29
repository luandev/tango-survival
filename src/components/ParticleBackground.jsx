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
    circleHue = 4, // Hue for circles
    squareHue = 200,  // Hue for squares
    backgroundColor = 'transparent',
    maxOpacity = 1,
    hecticness = 1   // Controls animation intensity
}, ref) => {
    const particlePropsLength = particleCount * particlePropCount;
    const canvasRef = useRef(null);
    const particleProps = useRef(new Float32Array(particlePropsLength)).current;
    const tick = useRef(0);
    const center = useRef([window.innerWidth / 2, window.innerHeight / 2]);
    const animationFrameId = useRef(null);
    const effectTriggered = useRef(false);
    const hecticnessRef = useRef(hecticness);

    // Update hecticnessRef when hecticness prop changes
    useEffect(() => {
        hecticnessRef.current = hecticness;
    }, [hecticness]);

    // Expose the triggerEffect method to parent components
    useImperativeHandle(ref, () => ({
        triggerEffect: () => {
            effectTriggered.current = true;
        }
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
            const ttl = (baseTTL + Math.random() * rangeTTL) / hecticnessRef.current;
            const speed = (baseSpeed + Math.random() * rangeSpeed) * hecticnessRef.current;
            const size = baseSize + Math.random() * rangeSize;
            const shape = Math.random() < 0.5 ? 0 : 1; // 0 for square, 1 for circle
            const hue = shape === 1 ? circleHue : squareHue;

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

            if (effectTriggered.current) {
                // Particles shoot out from the center
                const angle = Math.atan2(y - center.current[1], x - center.current[0]);
                const vx = Math.cos(angle) * 100 * hecticnessRef.current;
                const vy = Math.sin(angle) * 100 * hecticnessRef.current;

                x += vx;
                y += vy;
            } else {
                const theta = Math.atan2(y - center.current[1], x - center.current[0]) + 0.75 * Math.PI / 2;
                const vx = 0.95 * particleProps[i + 2] + 0.05 * Math.cos(theta) * 2;
                const vy = 0.95 * particleProps[i + 3] + 0.05 * Math.sin(theta) * 2;

                x += vx * speed;
                y += vy * speed;

                particleProps[i + 2] = vx;
                particleProps[i + 3] = vy;
            }

            ctx.a.save();
            ctx.a.lineCap = 'round';
            ctx.a.lineWidth = 1;
            const currentOpacity = Math.min(fadeInOut(life, ttl), maxOpacity);
            ctx.a.strokeStyle = `hsla(${hue},100%,60%,${currentOpacity})`;
            ctx.a.beginPath();

            if (shape === 0) {
                // Draw Square Outline
                ctx.a.strokeRect(x - size / 2, y - size / 2, size, size);
            } else {
                // Draw Circle Outline
                ctx.a.arc(x, y, size / 2, 0, Math.PI * 2);
                ctx.a.stroke();
            }

            ctx.a.closePath();
            ctx.a.restore();

            // Update particle properties
            particleProps[i] = x;
            particleProps[i + 1] = y;
            particleProps[i + 4] = life;

            // Reinitialize particle if its life exceeds TTL or if it moves off-screen
            if (life > ttl || x < 0 || x > canvas.a.width || y < 0 || y > canvas.a.height) {
                initParticle(i);
            }

            // Reset effect after updating particles
            if (effectTriggered.current) {
                effectTriggered.current = false;
            }
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

            animationFrameId.current = requestAnimationFrame(draw);
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
            cancelAnimationFrame(animationFrameId.current);
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
        maxOpacity
        // Note: hecticness is managed via hecticnessRef and does not trigger reinitialization
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
    circleHue: PropTypes.number,
    squareHue: PropTypes.number,
    backgroundColor: PropTypes.string,
    maxOpacity: PropTypes.number,
    hecticness: PropTypes.number,
};

export default ParticleBackground;
