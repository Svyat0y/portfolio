import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/shared/lib/utils';

/**
 * Scroll-reveal that ENHANCES already-visible content.
 *
 * The hidden start state (opacity/translate) is defined in `global.scss` under
 * `html.reveal-ready` — a class this hook adds only once JS is actually running.
 * So without JS, or in a throttled/headless render, content shows normally and
 * a section can never ship blank. A safety timer reveals anything the observer
 * hasn't reached. Under `prefers-reduced-motion` the hook no-ops entirely, so
 * the hidden state is never applied.
 *
 * Attach the returned ref to a container marked `data-reveal-group`; its direct
 * children cascade in (stagger comes from CSS `:nth-child`).
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    document.documentElement.classList.add('reveal-ready');

    // The safety-timer path reveals instantly (no fade) — a throttled/headless
    // render could otherwise be captured mid-transition, showing content stuck
    // half-visible. `data-reveal-instant` tells the CSS to skip the transition
    // for that one reveal (see global.scss).
    const reveal = (instant = false) => {
      if (instant) el.dataset.revealInstant = 'true';
      el.dataset.revealed = 'true';
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            obs.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);

    // Safety net: if the observer never fires (hidden tab, no scroll), don't
    // leave the content stuck in its hidden start state.
    const timer = window.setTimeout(() => reveal(true), 1800);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return ref;
}
