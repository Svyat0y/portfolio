import { useEffect, useRef, useState } from 'react';
import { CENTER_BAND_ROOT_MARGIN } from './center-band';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function useSlideActive<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [activations, setActivations] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) return;

    let isFirstCallback = true;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isFirstCallback) {
            setActivations((n) => n + 1);
          }
        }
        isFirstCallback = false;
      },
      { threshold: 0, rootMargin: CENTER_BAND_ROOT_MARGIN },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [reducedMotion]);

  return { ref, activations };
}
