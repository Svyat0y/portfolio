import type { Project } from '../../projects.content';
import styles from './ProjectDetail.module.scss';

interface ProjectDetailProps {
  project: Project;
  closing: boolean;
  onBack: () => void;
  /** fires once the closing animation finishes — parent unmounts here */
  onExited: () => void;
}

/**
 * Fixed overlay + slide-in panel — independent of the page's scroll
 * position, so it always opens fully in view regardless of where in the
 * project list you clicked from (was a real problem on mobile when the
 * detail used to render inline).
 *
 * Closing plays the reverse animation before unmounting: `onBack` just asks
 * the parent to mark this as closing (`closing` prop flips to true); once
 * the panel's own close animation finishes, `onExited` tells the parent it's
 * safe to stop rendering this component.
 */
export function ProjectDetail({ project, closing, onBack, onExited }: ProjectDetailProps) {
  return (
    <div className={`${styles.overlay} ${closing ? styles.closing : ''}`} onClick={onBack}>
      <div
        className={styles.panel}
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
            <h2 className={styles.title}>{project.title}</h2>
            {project.highlight && <span className={styles.highlight}>{project.highlight}</span>}
          </div>

          {project.period && <p className={styles.period}>{project.period}</p>}

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
    </div>
  );
}
