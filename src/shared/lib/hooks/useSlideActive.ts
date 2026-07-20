import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/shared/lib/utils';

/**
 * Replayable counterpart to `useReveal`: fires every time the attached
 * element becomes the dominant section in the viewport (via the same
 * center-band technique as `useActiveSection`), not just once. Drives the
 * per-section slide-arrival flourish (title re-scramble + scan-line, see
 * `SectionShell` and `Hero`) — the existing one-shot content stagger-fade
 * (`useReveal`) is untouched and lives alongside this.
 *
 * `data-slide-active` is set/removed directly on the DOM node (like
 * `useReveal`'s `el.dataset.revealed`) so CSS alone can drive the scan-line
 * animation. `activations` is plain React state, for consumers that need a
 * re-render (e.g. as a `key` to remount and replay a `ScrambleText` title).
 *
 * The very first observer callback reports whatever is already true at
 * mount time — for a section that's on-screen at page load (Hero) that's an
 * immediate "intersecting" report a frame after mount, which would otherwise
 * remount-and-replay a title that just played its own mount animation.
 * That first callback is allowed to set `data-slide-active` (a page-load
 * scan-line is fine) but never increments `activations`.
 */
export function useSlideActive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [activations, setActivations] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let isFirstCallback = true;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.slideActive = 'true';
            if (!isFirstCallback) setActivations((n) => n + 1);
          } else {
            delete el.dataset.slideActive;
          }
        }
        isFirstCallback = false;
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return { ref, activations };
}
