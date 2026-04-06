import React, { useEffect, useRef, useState } from 'react';

/**
 * FireflyBackground — Custom canvas-based firefly animation.
 * Covers the entire viewport on all pages.
 * Responds to mouse movement.
 * Pauses when tab is hidden.
 * Fully performant — no lag on mobile or desktop.
 */
const FireflyBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const firefliesRef = useRef([]);
  const [motionEnabled, setMotionEnabled] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });

    let resizeTimer = null;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const FIREFLY_COUNT = Math.min(
      Math.floor((window.innerWidth * window.innerHeight) / 14000),
      120 
    );

    const COLORS = [
      { r: 212, g: 185, b: 100 }, 
      { r: 230, g: 200, b: 120 }, 
      { r: 180, g: 210, b: 140 }, 
      { r: 224, g: 169, b: 100 }, 
      { r: 200, g: 220, b: 160 }, 
    ];

    const randBetween = (a, b) => a + Math.random() * (b - a);

    const createFirefly = (w, h) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: randBetween(0, w),
        y: randBetween(0, h),
        vx: randBetween(-0.18, 0.18),
        vy: randBetween(-0.18, 0.18),
        pulsePhase: randBetween(0, Math.PI * 2),
        pulseSpeed: randBetween(0.008, 0.022),
        size: randBetween(1.2, 2.8),
        glowRadius: randBetween(6, 18),
        color,
        tail: [],
        tailLength: Math.floor(randBetween(4, 12)),
        pushX: 0,
        pushY: 0,
        wanderAngle: randBetween(0, Math.PI * 2),
        wanderSpeed: randBetween(0.005, 0.018),
      };
    };

    const init = () => {
      const w = canvas.width;
      const h = canvas.height;
      firefliesRef.current = Array.from(
        { length: FIREFLY_COUNT },
        () => createFirefly(w, h)
      );
    };

    const draw = () => {
      if (document.hidden || !motionEnabled) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.fillStyle = 'rgba(10, 22, 18, 0.18)';
      ctx.fillRect(0, 0, w, h);

      firefliesRef.current.forEach((ff) => {
        ff.wanderAngle += (Math.random() - 0.5) * ff.wanderSpeed;
        ff.vx += Math.cos(ff.wanderAngle) * 0.004;
        ff.vy += Math.sin(ff.wanderAngle) * 0.004;

        const maxSpeed = 0.28;
        const speed = Math.sqrt(ff.vx * ff.vx + ff.vy * ff.vy);
        if (speed > maxSpeed) {
          ff.vx = (ff.vx / speed) * maxSpeed;
          ff.vy = (ff.vy / speed) * maxSpeed;
        }

        const dx = ff.x - mx;
        const dy = ff.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const disturbRadius = 140;

        if (dist < disturbRadius && dist > 0) {
          const force = (1 - dist / disturbRadius) * 0.6;
          ff.pushX += (dx / dist) * force;
          ff.pushY += (dy / dist) * force;
        }

        ff.pushX *= 0.92;
        ff.pushY *= 0.92;

        ff.x += ff.vx + ff.pushX;
        ff.y += ff.vy + ff.pushY;

        const margin = 20;
        if (ff.x < -margin) ff.x = w + margin;
        if (ff.x > w + margin) ff.x = -margin;
        if (ff.y < -margin) ff.y = h + margin;
        if (ff.y > h + margin) ff.y = -margin;

        ff.pulsePhase += ff.pulseSpeed;
        const rawPulse = (Math.sin(ff.pulsePhase) + 1) / 2;
        const pulse = Math.pow(rawPulse, 2.2);

        const opacity = 0.04 + pulse * 0.78;

        const mouseBoost = dist < disturbRadius
          ? (1 - dist / disturbRadius) * 0.4
          : 0;
        const finalOpacity = Math.min(opacity + mouseBoost, 1.0);

        const { r, g, b } = ff.color;

        ff.tail.unshift({ x: ff.x, y: ff.y, opacity: finalOpacity * 0.3 });
        if (ff.tail.length > ff.tailLength) ff.tail.pop();

        ff.tail.forEach((pt, i) => {
          const tailFade = (1 - i / ff.tailLength) * pt.opacity * 0.5;
          if (tailFade < 0.005) return;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, ff.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${tailFade})`;
          ctx.fill();
        });

        const halo = ctx.createRadialGradient(
          ff.x, ff.y, 0,
          ff.x, ff.y, ff.glowRadius * (1 + pulse * 0.5)
        );
        halo.addColorStop(0, `rgba(${r},${g},${b},${finalOpacity * 0.22})`);
        halo.addColorStop(0.4, `rgba(${r},${g},${b},${finalOpacity * 0.08})`);
        halo.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.glowRadius * (1 + pulse * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        const coreGlow = ctx.createRadialGradient(
          ff.x, ff.y, 0,
          ff.x, ff.y, ff.size * 2
        );
        coreGlow.addColorStop(0, `rgba(255,248,220,${finalOpacity})`); 
        coreGlow.addColorStop(0.5, `rgba(${r},${g},${b},${finalOpacity * 0.8})`);
        coreGlow.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = coreGlow;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      if (!document.hidden && !animationRef.current) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();

    window.addEventListener('resize', debouncedResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [motionEnabled]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#0A1612',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
      <button
        onClick={() => setMotionEnabled((v) => !v)}
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          zIndex: 50,
          padding: '4px 10px',
          fontSize: '10px',
          background: 'rgba(10,22,18,0.7)',
          border: '1px solid rgba(212,165,116,0.3)',
          color: '#A8B3AF',
          borderRadius: '4px',
          cursor: 'pointer',
          pointerEvents: 'auto',
          letterSpacing: '0.05em',
        }}
        aria-label="Toggle firefly animation"
      >
        {motionEnabled ? '✦ Fireflies ON' : '✦ Fireflies OFF'}
      </button>
    </div>
  );
};

export default FireflyBackground;