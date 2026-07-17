import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/shared/lib/utils';
import { randomScrambleChar, startResolve } from './scramble-glyphs';

/**
 * Continuously shuffles `text` while `active` is true (never settles) — used
 * for the header name while the Hero section is in view. When `active`
 * turns false, it resolves letter-by-letter into the real text and holds
 * there, matching the one-shot scramble grammar used elsewhere.
 */

const LOOP_TICK_MS = 110;
const RESOLVE_DURATION = 700;

interface InfiniteScrambleOptions {
  active: boolean;
}

export function useInfiniteScramble(text: string, { active }: InfiniteScrambleOptions) {
  const [reducedMotion] = useState(prefersReducedMotion);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reducedMotion) return;

    if (active) {
      const id = window.setInterval(() => {
        setDisplay(Array.from(text, (ch) => (ch === ' ' ? ch : randomScrambleChar())).join(''));
      }, LOOP_TICK_MS);
      return () => window.clearInterval(id);
    }

    // settle into the real text, one letter at a time
    return startResolve(text, RESOLVE_DURATION, LOOP_TICK_MS, setDisplay);
  }, [active, text, reducedMotion]);

  return reducedMotion ? text : display;
}
