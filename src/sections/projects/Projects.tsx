import { useCallback, useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { SectionShell } from '@/shared/ui/section-shell';
import { projects, type Project } from './projects.content';
import { ProjectCard } from './components/project-card';
import { ProjectDetail } from './components/project-detail';
import styles from './Projects.module.scss';

const PROJECT_PARAM = 'project';

/**
 * Cards per carousel row/slide, tiered to match `.grid`'s own column
 * breakpoints (Projects.module.scss): 4 columns above 1200px (desktop), 2
 * between 769–1200px (tablet), 1 at or below 768px (mobile).
 */
function getItemsPerSlide(): number {
  if (typeof window === 'undefined') return 4;
  if (window.matchMedia('(max-width: 768px)').matches) return 1;
  if (window.matchMedia('(max-width: 1200px)').matches) return 2;
  return 4;
}

/** Fills each page to `size` cards, leaving only the trailing page short —
 * e.g. 5 items at size 4 → [4, 1]; 15 items at size 4 → [4, 4, 4, 3]. Cards
 * have a fixed height (ProjectCard.module.scss), so a short trailing page
 * never affects row height/spacing regardless of its card count. */
function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function projectFromLocation(): Project | null {
  const slug = new URLSearchParams(window.location.search).get(PROJECT_PARAM);
  if (!slug) return null;
  return projects.find((project) => slugify(project.title) === slug) ?? null;
}

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(() => projectFromLocation());
  const [closing, setClosing] = useState(false);
  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide);
  const pages = useMemo(() => chunk(projects, itemsPerSlide), [itemsPerSlide]);
  const hasMultiplePages = pages.length > 1;

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)');
    const tablet = window.matchMedia('(max-width: 1200px)');
    const handleChange = () => setItemsPerSlide(getItemsPerSlide());
    mobile.addEventListener('change', handleChange);
    tablet.addEventListener('change', handleChange);
    return () => {
      mobile.removeEventListener('change', handleChange);
      tablet.removeEventListener('change', handleChange);
    };
  }, []);

  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
  const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const selectProject = useCallback((project: Project) => {
    setClosing(false);
    setSelected(project);
    const url = new URL(window.location.href);
    url.searchParams.set(PROJECT_PARAM, slugify(project.title));
    window.history.pushState({ projectDetail: true }, '', url);
  }, []);

  const closeDetail = useCallback(() => {
    if (window.history.state?.projectDetail) {
      window.history.back();
    } else {
      setClosing(true);
      const url = new URL(window.location.href);
      url.searchParams.delete(PROJECT_PARAM);
      window.history.replaceState({}, '', url);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const project = projectFromLocation();
      if (project) {
        setClosing(false);
        setSelected(project);
      } else {
        setClosing(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!swiper) return;
    document.fonts?.ready.then(() => {
      if (!swiper.destroyed) swiper.updateAutoHeight();
    });
  }, [swiper]);

  return (
    <SectionShell id="projects" title="Projects">
      <div className={styles.carousel}>
        <Swiper
          key={itemsPerSlide}
          className={styles.swiper}
          onSwiper={setSwiper}
          modules={[Navigation, Pagination, Autoplay, Keyboard]}
          navigation={hasMultiplePages ? { prevEl, nextEl } : false}
          pagination={hasMultiplePages ? { el: paginationEl, clickable: true } : false}
          keyboard={{ enabled: true }}
          loop={hasMultiplePages}
        >
          {pages.map((pageProjects, index) => (
            <SwiperSlide key={index}>
              <ul
                className={styles.grid}
                style={
                  itemsPerSlide < 4
                    ? { gridTemplateColumns: `repeat(${pageProjects.length}, minmax(0, 1fr))` }
                    : undefined
                }
              >
                {pageProjects.map((project) => (
                  <li key={project.title}>
                    <ProjectCard project={project} onSelect={() => selectProject(project)} />
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
