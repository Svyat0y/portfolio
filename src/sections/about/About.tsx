import { identity } from '@/shared/config';
import { SectionShell } from '@/shared/ui/section-shell';
import { aboutContent } from './about.content';
import styles from './About.module.scss';

export function About() {
  const { resume } = aboutContent;

  return (
    <SectionShell
      id="about"
      title="About"
      aside={
        <div className={styles.resume}>
          <div className={styles.resumeFrame}>
            <img
              src={resume.previewSrc}
              alt={`${identity.name}'s résumé`}
              className={styles.resumeImg}
            />
          </div>
          <a className="pill-link" href={resume.downloadHref} download>
            {resume.downloadLabel}
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
