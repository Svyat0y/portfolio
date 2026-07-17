import { useCallback, useEffect, useState } from 'react';
import type { SectionId } from '@/shared/config';

/**
 * Plain document scroll. Tracks which section is in view (for the header
 * highlight) via IntersectionObserver, and `goTo` smooth-scrolls to a
 * section by id — no scroll-hijacking, no smoothing library. Simple and
 * robust on mobile, where the previous full-page-slide mode clipped content
 * that ran taller than the viewport.
 *
 * `rootMargin` shrinks the observer's effective viewport to a thin band
 * across the middle (10% tall); a section only counts as "active" while it
 * crosses that band. A flat `threshold: 0.5` (50% of the section visible)
 * silently never fires for any section taller than 2× the viewport — About
 * already runs 1.5× on mobile — so the header highlight would freeze on the
 * previous section. The middle-band technique scales to any section height.
 */
export function useActiveSection(sectionIds: SectionId[]) {
  const [activeSection, setActiveSection] = useState<SectionId>(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        }
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' },
    );
    document.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return { activeSection, goTo };
}
