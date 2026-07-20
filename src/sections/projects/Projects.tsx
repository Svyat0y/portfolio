import { useCallback, useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { SectionShell } from '@/shared/ui/section-shell';
import { projects, type Project } from './projects.content';
import { ProjectCard } from './components/project-card';
import { ProjectDetail } from './components/project-detail';
import styles from './Projects.module.scss';

const SLIDE_SIZE = 6;
const AUTOPLAY_DELAY = 6000;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [closing, setClosing] = useState(false);
  const pages = useMemo(() => chunk(projects, SLIDE_SIZE), []);
  const hasMultiplePages = pages.length > 1;

  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
  const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  // stable identity — ProjectDetail depends on this in a effect (Escape handler)
  const closeDetail = useCallback(() => setClosing(true), []);

  useEffect(() => {
    if (!swiper) return;
    // `autoHeight` measures each slide's content height at mount — before the
    // web fonts (Space Grotesk / JetBrains Mono, loaded via <link> in
    // index.html) finish swapping in. Text can re-wrap taller once they do,
    // leaving the wrapper a few px short of the real content height; `.swiper`
    // clips overflow (Swiper's own carousel default), so that shortfall cut
    // off the last row's bottom edge. Recalculate once fonts are truly ready.
    // Must call `updateAutoHeight()` directly, not the general `update()` —
    // Swiper's `update()` only re-triggers autoHeight internally when
    // `freeMode` is enabled, which this carousel doesn't use.
    document.fonts?.ready.then(() => {
      if (!swiper.destroyed) swiper.updateAutoHeight();
    });
  }, [swiper]);

  return (
    <SectionShell id="projects" title="Projects">
      <div className={styles.carousel}>
        <Swiper
          className={styles.swiper}
          autoHeight={true}
          onSwiper={setSwiper}
          modules={[Navigation, Pagination, Autoplay, Keyboard]}
          navigation={hasMultiplePages ? { prevEl, nextEl } : false}
          pagination={hasMultiplePages ? { el: paginationEl, clickable: true } : false}
          keyboard={{ enabled: true }}
          loop={hasMultiplePages}
          autoplay={
            hasMultiplePages
              ? { delay: AUTOPLAY_DELAY, disableOnInteraction: false, pauseOnMouseEnter: true }
              : false
          }
        >
          {pages.map((pageProjects, index) => (
            <SwiperSlide key={index}>
              <ul className={styles.grid}>
                {pageProjects.map((project) => (
                  <li key={project.title}>
                    <ProjectCard
                      project={project}
                      onSelect={() => {
                        setClosing(false);
                        setSelected(project);
                      }}
                    />
                  </li>
                ))}
              </ul>
            </SwiperSlide>
          ))}
        </Swiper>

        {hasMultiplePages && (
          <div className={styles.controls}>
            <button
              ref={setPrevEl}
              type="button"
              className={styles.arrow}
              aria-label="Previous projects"
            >
              ‹
            </button>
            <div ref={setPaginationEl} className={styles.pagination} />
            <button
              ref={setNextEl}
              type="button"
              className={styles.arrow}
              aria-label="Next projects"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {selected && (
        <ProjectDetail
          project={selected}
          closing={closing}
          onBack={closeDetail}
          onExited={() => setSelected(null)}
        />
      )}
    </SectionShell>
  );
}
