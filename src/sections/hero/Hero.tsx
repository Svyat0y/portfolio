import { identity } from '@/shared/config';
import { useSlideActive } from '@/shared/lib/hooks';
import { ScrambleText } from '@/shared/ui/scramble-text';
import styles from './Hero.module.scss';

export function Hero() {
  const { ref, activations } = useSlideActive<HTMLElement>();

  return (
    <section id="hero" className={`section ${styles.hero}`} ref={ref}>
      <div className="section-inner">
        <p className={styles.intro}>
          <ScrambleText key={`intro-${activations}`} text="// portfolio" playOnMount duration={900} />
        </p>
        <h1 className={styles.name}>
          <ScrambleText key={`name-${activations}`} text={identity.name} playOnMount duration={1400} />
        </h1>
        <p className={styles.role}>
          <ScrambleText key={`role-${activations}`} text={identity.role} playOnMount duration={1100} />
        </p>
        <p className={styles.tagline}>{identity.tagline}</p>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollArrow}>↓</span>
        <span>scroll</span>
      </div>
    </section>
  );
}
