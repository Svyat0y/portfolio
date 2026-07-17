import { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useReveal } from '@/shared/lib/hooks';
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

  const revealRef = useReveal<HTMLDivElement>();

  const closeDetail = () => setClosing(true);

  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [selected]);

  return (
    <section id="projects" className="section">
      <div className="section-inner" data-reveal-group ref={revealRef}>
        <h2 className={styles.title}>
          <span className="section-mark" aria-hidden="true">
            //
          </span>
          Projects
        </h2>

        <div className={styles.carousel}>
          <Swiper
            className={styles.swiper}
            autoHeight={true}
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
      </div>

      {selected && (
        <ProjectDetail
          project={selected}
          closing={closing}
          onBack={closeDetail}
          onExited={() => setSelected(null)}
        />
      )}
    </section>
  );
}
