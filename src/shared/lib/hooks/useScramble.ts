import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/shared/lib/utils';
import { startResolve } from './scramble-glyphs';

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
  const stopRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
  }, []);

  const play = useCallback(() => {
    if (prefersReducedMotion()) return;
    stop();
    stopRef.current = startResolve(text, duration, TICK_MS, setDisplay);
  }, [text, duration, stop]);

  // text is static for a given instance in this app; only clean up on unmount
  useEffect(() => stop, [stop]);

  return { display, play };
}
