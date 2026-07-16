import { identity } from '@/shared/config';
import { ScrambleText } from '@/shared/ui/scramble-text';
import styles from './Hero.module.scss';

export function Hero() {
  return (
    <section id="hero" className={`section ${styles.hero}`}>
      <div className="section-inner">
        <p className={styles.intro}>
          <ScrambleText text="// portfolio" playOnMount duration={900} />
        </p>
        <h1 className={styles.name}>
          <ScrambleText text={identity.name} playOnMount duration={1400} />
        </h1>
        <p className={styles.role}>
          <ScrambleText text={identity.role} playOnMount duration={1100} />
        </p>
        <p className={styles.tagline}>{identity.tagline}</p>
      </div>

      {/*<div className={styles.scrollHint} aria-hidden="true">*/}
      {/*  <span className={styles.scrollArrow}>↓</span>*/}
      {/*  <span className={styles.scrollLabel}>scroll</span>*/}
      {/*</div>*/}
    </section>
  );
}
