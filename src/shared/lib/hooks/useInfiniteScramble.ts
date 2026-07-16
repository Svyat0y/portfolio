import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, randomScrambleChar } from './scramble-glyphs';

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
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const stop = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (active) {
      intervalRef.current = window.setInterval(() => {
        setDisplay(Array.from(text, (ch) => (ch === ' ' ? ch : randomScrambleChar())).join(''));
      }, LOOP_TICK_MS);
      return stop;
    }

    // settle into the real text, one letter at a time
    const totalTicks = Math.max(2, Math.round(RESOLVE_DURATION / LOOP_TICK_MS));
    const lockAt = Array.from({ length: text.length }, () =>
      Math.floor(totalTicks * (0.25 + Math.random() * 0.75)),
    );
    let tick = 0;

    intervalRef.current = window.setInterval(() => {
      tick += 1;
      let out = '';
      let done = true;
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        if (ch === ' ' || tick >= lockAt[i]) {
          out += ch;
        } else {
          done = false;
          out += randomScrambleChar();
        }
      }
      setDisplay(out);
      if (done) stop();
    }, LOOP_TICK_MS);

    return stop;
  }, [active, text, reducedMotion]);

  return reducedMotion ? text : display;
}
