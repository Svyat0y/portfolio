import type { Project } from '../../projects.content';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: Project;
  onSelect: () => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <button type="button" className={styles.card} onClick={onSelect}>
      <span className={styles.name}>{project.title}</span>
      <div className={styles.meta}>
        {project.highlight && <span className={styles.highlight}>{project.highlight}</span>}
        <span className={styles.badge}>{project.url ? 'public' : 'private'}</span>
        {project.tags?.map((tag) => (
          <span key={tag} className={styles.badge}>
            {tag}
          </span>
        ))}
      </div>
      <p className={styles.summary}>{project.summary}</p>
      <span className={styles.stack}>{project.stack.join(' · ')}</span>
    </button>
  );
}
