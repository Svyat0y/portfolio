import type { Project } from '../../projects.content';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <button type="button" className={styles.card} onClick={onSelect}>
      <div className={styles.heading}>
        <span className={styles.name}>{project.title}</span>
        {project.highlight && <span className={styles.highlight}>{project.highlight}</span>}
        {!project.url && <span className={styles.badge}>private</span>}
      </div>
      <p className={styles.summary}>{project.summary}</p>
      <span className={styles.stack}>{project.stack.join(' · ')}</span>
    </button>
  );
}
