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

    // Elements already on-screen at mount (Hero on first load; any section a
    // reload happens to land on, since the browser restores scroll position
    // before this effect runs) get their IntersectionObserver "intersecting"
    // callback almost in the same frame as the hidden state was applied
    // above — the browser then coalesces both style changes into a single
    // paint and the CSS transition never gets a "before" frame to animate
    // from. A double rAF forces at least one committed paint of the hidden
    // state first, so the transition always has something to animate from.
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

    // Safety net for a genuinely stuck case: the tab was backgrounded at
    // mount (or becomes backgrounded before the user ever scrolls here), so
    // rAF/IntersectionObserver callbacks are throttled and may never fire.
    // Only arm it while the document is actually hidden — a normal visible
    // tab relies on the IntersectionObserver alone, so content stays hidden
    // until the user genuinely scrolls the section into view.
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
  }, []);

  return ref;
}
