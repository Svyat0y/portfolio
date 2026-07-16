import { useCallback, useEffect, useState } from 'react';
import type { SectionId } from '@/shared/config';

/**
 * Plain document scroll. Tracks which section is in view (for the header
 * highlight) via IntersectionObserver, and `goTo` smooth-scrolls to a
 * section by id — no scroll-hijacking, no smoothing library. Simple and
 * robust on mobile, where the previous full-page-slide mode clipped content
 * that ran taller than the viewport.
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
      { threshold: 0.5 },
    );
    document.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return { activeSection, goTo };
}
