import { SectionShell } from '@/shared/ui/section-shell';
import { aboutContent } from './about.content';
import styles from './About.module.scss';

export function About() {
  return (
    <SectionShell
      id="about"
      title="About"
      aside={
        <div className={styles.resume}>
          <div className={styles.resumeFrame}>
            <img
              src="/resume-preview.jpg"
              alt="Alexander Pop's résumé"
              className={styles.resumeImg}
            />
          </div>
          <a className="pill-link" href="/resume.pdf" download>
            download CV ↓
          </a>
        </div>
      }
    >
      <div className={styles.bio}>
        {aboutContent.paragraphs.map((paragraph) => (
          <p key={paragraph} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </SectionShell>
  );
}
