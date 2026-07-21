import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/shared/lib/utils';
import styles from './BackdropField.module.scss';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const DENSITY = 9000; // one particle per ~9000 px² of viewport
const MAX_PARTICLES = 170;
const LINK_DIST = 140; // px within which two particles are linked
const CURSOR_DIST = 230; // px radius the cursor parts the field within
const PUSH = 46; // max displacement (px) away from the cursor
const FALLBACK_ACCENT_RGB = '198, 255, 53';

/**
 * Demo C — generative constellation (cursor parts the field). Lime particles
 * drift and link by proximity. The cursor doesn't clump them: it displaces
 * nearby particles outward for a render frame (so the web flows AROUND the
 * cursor and springs back as it leaves) and reaches bright links out to them.
 * Displacement is render-only — particle positions keep their steady drift, so
 * nothing accumulates. `prefers-reduced-motion` paints one static frame.
 */
export function BackdropField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    // single-source the accent color from tokens.scss (--color-accent-rgb)
    // instead of hardcoding the same RGB triple again here.
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue('--color-accent-rgb').trim() ||
      FALLBACK_ACCENT_RGB;
    let width = 0;
    let height = 0;
    const particles: Particle[] = [];
    // render positions (post-displacement), reused for the link pass
    let rx: number[] = [];
    let ry: number[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const makeParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
    });

    const targetCount = () => Math.min(MAX_PARTICLES, Math.round((width * height) / DENSITY));

    // Fit the field to the current dimensions WITHOUT reshuffling: rescale each
    // particle's position proportionally (the constellation smoothly squeezes/
    // stretches instead of jumping to fresh random spots on every resize event),
    // then top up or trim the count to match the new area. `prevW/prevH === 0`
    // is the first call (empty field) — nothing to rescale, just seed to count.
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
      // Self-heal if a resize happened while this tab was backgrounded — the
      // `resize` event doesn't reliably fire for hidden/inactive tabs, which
      // would otherwise leave the canvas stuck at a stale size.
      if (window.innerWidth !== width || window.innerHeight !== height) resize();

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
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_DIST && d > 0.01) {
            lit = true;
            const k = 1 - d / CURSOR_DIST;
            const off = k * k * PUSH; // ease-in displacement, stronger up close
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

      // cursor node
      if (pointer.active) {
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent}, 0.7)`;
        ctx.fill();
      }

      // links between nearby particles (using displaced render positions)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = rx[i] - rx[j];
          const dy = ry[i] - ry[j];
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
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

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    // `pointerleave` on the root element (unlike `pointerout` on window) only
    // fires when the pointer truly leaves the page, not on every element
    // boundary crossed within it — `pointerout` bubbles per-element and made
    // the halo flicker off for a frame each time the cursor crossed into a
    // card, button, etc.
    document.documentElement.addEventListener('pointerleave', onLeave);

    if (reduce) draw();
    else loop();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.glow} />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
