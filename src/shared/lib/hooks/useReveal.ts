import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) return;

    document.documentElement.classList.add('reveal-ready');

    const reveal = (instant = false) => {
      if (instant) el.dataset.revealInstant = 'true';
      el.dataset.revealed = 'true';
    };

    let rafId: number | undefined;
    const revealNextFrame = () => {
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => reveal());
      });
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealNextFrame();
            obs.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);

    let timer: number | undefined;

    const armIfHidden = () => {
      if (document.hidden && timer === undefined) {
        timer = window.setTimeout(() => reveal(true), 1800);
      }
    };
    armIfHidden();
    document.addEventListener('visibilitychange', armIfHidden);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', armIfHidden);
      if (timer !== undefined) window.clearTimeout(timer);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return ref;
}
