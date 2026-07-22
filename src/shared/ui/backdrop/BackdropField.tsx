import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/shared/lib/utils';
import styles from './BackdropField.module.scss';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const DENSITY = 9000;
const MAX_PARTICLES = 170;
const LINK_DIST = 140;
const CURSOR_DIST = 230;
const PUSH = 46;
const FALLBACK_ACCENT_RGB = '198, 255, 53';

export function BackdropField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue('--color-accent-rgb').trim() ||
      FALLBACK_ACCENT_RGB;
    let width = 0;
    let height = 0;
    const particles: Particle[] = [];
    let rx: number[] = [];
    let ry: number[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    let scrolling = false;
    let scrollEndTimer = 0;

    const makeParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
    });

    const targetCount = () => Math.min(MAX_PARTICLES, Math.round((width * height) / DENSITY));

    const cursorDistSq = CURSOR_DIST * CURSOR_DIST;
    const linkDistSq = LINK_DIST * LINK_DIST;

    const fit = (prevW: number, prevH: number) => {
      if (prevW > 0 && prevH > 0 && (prevW !== width || prevH !== height)) {
        const sx = width / prevW;
        const sy = height / prevH;
        for (const p of particles) {
          p.x *= sx;
          p.y *= sy;
        }
      }
      const count = targetCount();
      while (particles.length < count) particles.push(makeParticle());
      if (particles.length > count) particles.length = count;
      rx = new Array(particles.length).fill(0);
      ry = new Array(particles.length).fill(0);
    };

    const resize = () => {
      const prevW = width;
      const prevH = height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fit(prevW, prevH);
    };

    const draw = () => {
      if (!scrolling && (window.innerWidth !== width || window.innerHeight !== height)) resize();

      ctx.clearRect(0, 0, width, height);

      if (pointer.active) {
        const halo = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          CURSOR_DIST,
        );
        halo.addColorStop(0, `rgba(${accent}, 0.05)`);
        halo.addColorStop(1, 'transparent');
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += width;
        else if (p.x > width) p.x -= width;
        if (p.y < 0) p.y += height;
        else if (p.y > height) p.y -= height;

        let x = p.x;
        let y = p.y;
        let lit = false;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < cursorDistSq && dSq > 0.0001) {
            const d = Math.sqrt(dSq);
            lit = true;
            const k = 1 - d / CURSOR_DIST;
            const off = k * k * PUSH;
            x = p.x + (dx / d) * off;
            y = p.y + (dy / d) * off;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.strokeStyle = `rgba(${accent}, ${k * 0.22})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        rx[i] = x;
        ry[i] = y;
        ctx.beginPath();
        ctx.arc(x, y, lit ? 1.7 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent}, ${lit ? 0.72 : 0.3})`;
        ctx.fill();
      }

      if (pointer.active) {
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent}, 0.7)`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = rx[i] - rx[j];
          const dy = ry[i] - ry[j];
          const dSq = dx * dx + dy * dy;
          if (dSq < linkDistSq) {
            const d = Math.sqrt(dSq);
            ctx.beginPath();
            ctx.moveTo(rx[i], ry[i]);
            ctx.lineTo(rx[j], ry[j]);
            ctx.strokeStyle = `rgba(${accent}, ${(1 - d / LINK_DIST) * 0.09})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    let frame = 0;
    const loop = () => {
      draw();
      frame = window.requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      pointer.x = touch.clientX;
      pointer.y = touch.clientY;
      pointer.active = true;
    };
    const onTouchEnd = () => {
      pointer.active = false;
    };
    const onScroll = () => {
      scrolling = true;
      window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(() => {
        scrolling = false;
        resize();
      }, 160);
    };
    const onResize = () => {
      if (!scrolling) resize();
    };

    resize();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    if (reduce) draw();
    else loop();

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(scrollEndTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.glow} />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
