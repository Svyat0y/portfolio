import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, randomScrambleChar } from './scramble-glyphs';

/**
 * Matrix-style text scramble (mira-festival header effect).
 * While a letter is "unresolved" it flickers through random glyphs and black
 * squares, then locks into the real character. Each letter resolves at its
 * own random moment, so words reassemble piece by piece.
 */

const TICK_MS = 35;

interface ScrambleOptions {
  /** total effect length in ms */
  duration?: number;
}

export function useScramble(text: string, options: ScrambleOptions = {}) {
  const { duration = 700 } = options;
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (prefersReducedMotion()) return;
    stop();

    const totalTicks = Math.max(2, Math.round(duration / TICK_MS));
    // each letter picks the tick at which it locks back in
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
    }, TICK_MS);
  }, [text, duration, stop]);

  // text is static for a given instance in this app; only clean up on unmount
  useEffect(() => stop, [stop]);

  return { display, play };
}
