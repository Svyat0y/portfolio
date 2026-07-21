import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '../../projects.content';
import styles from './ProjectDetail.module.scss';

interface ProjectDetailProps {
  project: Project;
  closing: boolean;
  onBack: () => void;
  /** fires once the closing animation finishes — parent unmounts here */
  onExited: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Fixed overlay + slide-in panel — independent of the page's scroll
 * position, so it always opens fully in view regardless of where in the
 * project list you clicked from (was a real problem on mobile when the
 * detail used to render inline).
 *
 * Rendered via a portal straight into `document.body`, not inline where
 * `Projects` calls it (inside `<main>`). `<main>` establishes its own
 * stacking context (see `global.scss`, needed so the backdrop canvas stays
 * behind page content), which would otherwise trap this panel's `z-index`
 * inside `main` — unable to rise above `Header` (a sibling of `main`, outside
 * that context) even at `z-index: 200`. The portal escapes `main` entirely so
 * the panel's stacking is compared directly against Header's in the root
 * context, where it correctly wins and blocks header nav while open.
 *
 * Dialog semantics: `role="dialog"` + `aria-modal` + `aria-labelledby` the
 * project title; focus moves into the panel on open and is trapped there
 * (Tab cycles, doesn't escape to the hidden page behind); `#root` gets
 * `inert` for the same reason (belt-and-suspenders — blocks focus/pointer/AT
 * access to the rest of the page even if the trap is ever bypassed). Closing
 * restores focus to whatever triggered the panel (the project card).
 *
 * Closing plays the reverse animation before unmounting: `onBack` just asks
 * the parent to mark this as closing (`closing` prop flips to true); once
 * the panel's own close animation finishes, `onExited` tells the parent it's
 * safe to stop rendering this component.
 *
 * Self-contained: this component owns everything about being a modal —
 * portal, dialog semantics, focus trap/restore, body scroll-lock, and the
 * Escape key — so `Projects` only needs to hold `selected` state and mount it.
 */
export function ProjectDetail({ project, closing, onBack, onExited }: ProjectDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.getElementById('root');
    const previouslyFocused = document.activeElement as HTMLElement | null;

    root?.setAttribute('inert', '');
    const target = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    target?.style.setProperty('outline', 'none');
    target?.focus({ preventScroll: true });
    const restoreRing = () => target?.style.removeProperty('outline');
    target?.addEventListener('keydown', restoreRing, { once: true });
    target?.addEventListener('blur', restoreRing, { once: true });

    return () => {
      root?.removeAttribute('inert');
      previouslyFocused?.focus();
      restoreRing();
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onBack]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return createPortal(
    <div className={`${styles.overlay} ${closing ? styles.closing : ''}`} onClick={onBack}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        onClick={(event) => event.stopPropagation()}
        onAnimationEnd={(event) => {
          if (closing && event.currentTarget === event.target) onExited();
        }}
      >
        <div className={styles.content}>
          <button type="button" className={styles.back} onClick={onBack}>
            ← back to projects
          </button>

          <div className={styles.heading}>
            <h2 id="project-detail-title" className={styles.title}>
              {project.title}
            </h2>
            {project.highlight && <span className={styles.highlight}>{project.highlight}</span>}
          </div>

          {project.period && <p className={styles.period}>{project.period}</p>}

          {project.screenshots && project.screenshots.length > 0 && (
            <ul className={styles.screenshots}>
              {project.screenshots.map((src, index) => (
                <li key={src} className={styles.screenshot}>
                  <a href={src} target="_blank" rel="noreferrer">
                    <img
                      src={src}
                      alt={`${project.title} screenshot ${index + 1}`}
                      loading="lazy"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}

          <p className={styles.description}>{project.description}</p>

          <ul className={styles.stack}>
            {project.stack.map((tech) => (
              <li key={tech} className={styles.chip}>
                {tech}
              </li>
            ))}
          </ul>

          {project.url ? (
            <a className={styles.link} href={project.url} target="_blank" rel="noreferrer">
              Visit site ↗
            </a>
          ) : (
            <p className={styles.private}>Private / client project — no public link.</p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
