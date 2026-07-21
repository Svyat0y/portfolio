import { useCallback, useEffect, useRef, useState } from 'react';
import { startResolve } from './scramble-glyphs';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const TICK_MS = 35;

interface ScrambleOptions {
  duration?: number;
}

export function useScramble(text: string, options: ScrambleOptions = {}) {
  const { duration = 700 } = options;
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);
  const stopRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
  }, []);

  const play = useCallback(() => {
    if (reducedMotion) return;
    stop();
    stopRef.current = startResolve(text, duration, TICK_MS, setDisplay);
  }, [text, duration, stop, reducedMotion]);

  useEffect(() => stop, [stop]);

  return { display, play };
}
