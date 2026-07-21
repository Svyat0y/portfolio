import { useEffect, useState } from 'react';
import { randomScrambleChar, startResolve } from './scramble-glyphs';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const LOOP_TICK_MS = 110;
const RESOLVE_DURATION = 700;

interface InfiniteScrambleOptions {
  active: boolean;
}

export function useInfiniteScramble(text: string, { active }: InfiniteScrambleOptions) {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reducedMotion) return;

    if (active) {
      const id = window.setInterval(() => {
        setDisplay(Array.from(text, (ch) => (ch === ' ' ? ch : randomScrambleChar())).join(''));
      }, LOOP_TICK_MS);
      return () => window.clearInterval(id);
    }

    return startResolve(text, RESOLVE_DURATION, LOOP_TICK_MS, setDisplay);
  }, [active, text, reducedMotion]);

  return reducedMotion ? text : display;
}
