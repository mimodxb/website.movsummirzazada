import React, { useEffect, useRef } from 'react';

const FloatingParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    
    let animationFrameId;
    let particles = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const mouse = { x: -1000, y: -1000, radius: 180, active: false };
    const blooms = []; // Store mouse blooms

    const colors = [
      '212, 165, 116', // Primary glow
      '180, 210, 160', // Secondary glow
      '224, 169, 149'  // Accent glow
    ];

    class Particle {
      constructor(x, y, isSatellite = false, parent = null) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.width = Math.random() * 4 + 2; // 2-6px
        this.height = Math.random() * 2.5 + 1.5; // 1.5-4px
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;
        this.speedX = (Math.random() - 0.5) * 0.17 + (Math.random() > 0.5 ? 0.08 : -0.08); // 0.08 - 0.25
        this.speedY = (Math.random() - 0.5) * 0.17 + (Math.random() > 0.5 ? 0.08 : -0.08);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.phase = Math.random() * Math.PI * 2;
        this.phaseSpeed = Math.random() * 0.02 + 0.01;
        this.isSatellite = isSatellite;
        this.parent = parent;
        this.baseOpacity = Math.random() * 0.15 + 0.05;
        this.currentOpacity = this.baseOpacity;
        this.targetOpacity = this.baseOpacity;
        
        // Offset for satellites
        this.offsetX = isSatellite ? (Math.random() - 0.5) * 40 : 0;
        this.offsetY = isSatellite ? (Math.random() - 0.5) * 40 : 0;
      }

      update() {
        // Drift
        if (this.isSatellite && this.parent) {
          this.x = this.parent.x + this.offsetX;
          this.y = this.parent.y + this.offsetY;
          this.angle += this.spin * 2;
        } else {
          this.x += this.speedX;
          this.y += this.speedY;
          this.angle += this.spin;
          
          // Wrap around edges
          if (this.x < -20) this.x = width + 20;
          if (this.x > width + 20) this.x = -20;
          if (this.y < -20) this.y = height + 20;
          if (this.y > height + 20) this.y = -20;
        }

        // Breathing opacity (sine wave)
        this.phase += this.phaseSpeed;
        const breath = (Math.sin(this.phase) + 1) / 2; // 0 to 1
        
        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.targetOpacity = 0.35;
          if (!this.isSatellite) {
             this.x -= dx * force * 0.05;
             this.y -= dy * force * 0.05;
          }
        } else {
          this.targetOpacity = this.baseOpacity + breath * 0.1;
        }

        // Smooth opacity transition
        this.currentOpacity += (this.targetOpacity - this.currentOpacity) * 0.05;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = `rgba(${this.color}, ${this.currentOpacity})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width, this.height, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Soft glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.color}, ${this.currentOpacity})`;
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 8000), 350);
      
      for (let i = 0; i < count; i++) {
        const p = new Particle();
        particles.push(p);
        
        // Every 8th particle gets satellites
        if (i % 8 === 0) {
          const satCount = Math.floor(Math.random() * 3) + 2; // 2-4 satellites
          for (let j = 0; j < satCount; j++) {
            particles.push(new Particle(p.x, p.y, true, p));
          }
        }
      }
    };

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
      }, 200);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      
      // Add bloom
      blooms.push({ x: mouse.x, y: mouse.y, life: 1.0 });
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Initial setup
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = '#0A1612';
    ctx.fillRect(0, 0, width, height);
    initParticles();

    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Fade trail
      ctx.fillStyle = 'rgba(10, 22, 18, 0.12)';
      ctx.fillRect(0, 0, width, height);

      // Draw blooms
      for (let i = blooms.length - 1; i >= 0; i--) {
        const b = blooms[i];
        b.life -= 0.02; // fades over ~50 frames (approx 0.8s)
        if (b.life <= 0) {
          blooms.splice(i, 1);
          continue;
        }
        
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 100);
        grad.addColorStop(0, `rgba(212, 165, 116, ${b.life * 0.05})`);
        grad.addColorStop(1, 'rgba(212, 165, 116, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 100, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform',
        backgroundColor: '#0A1612'
      }}
    />
  );
};

export default FloatingParticles;