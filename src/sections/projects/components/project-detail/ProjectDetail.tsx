import { useCallback, useEffect, useRef } from 'react';
import { projectDetailText, type Project } from '../../projects.content';
import styles from './ProjectDetail.module.scss';

interface ProjectDetailProps {
  project: Project;
  closing: boolean;
  onBack: () => void;
  onExited: () => void;
}

export function ProjectDetail({ project, closing, onBack, onExited }: ProjectDetailProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const setDialogRef = useCallback((node: HTMLDialogElement | null) => {
    dialogRef.current = node;
    if (node && !node.open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      node.showModal();
      (node.firstElementChild as HTMLElement | null)?.focus();
    }
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, []);

  return (
    <dialog
      ref={setDialogRef}
      className={`${styles.overlay} ${closing ? styles.closing : ''}`}
      aria-labelledby="project-detail-title"
      onCancel={(event) => {
        event.preventDefault();
        onBack();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onBack();
      }}
    >
      <div
        className={styles.panel}
        tabIndex={-1}
        onAnimationEnd={(event) => {
          if (closing && event.currentTarget === event.target) onExited();
        }}
      >
        <div className={styles.content}>
          <button type="button" className={styles.back} onClick={onBack}>
            {projectDetailText.back}
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
              {projectDetailText.visit}
            </a>
          ) : (
            <p className={styles.private}>{projectDetailText.noLink}</p>
          )}
        </div>
      </div>
    </dialog>
  );
}
