import styles from './Backdrop.module.scss';
import { FRAGMENTS } from './backdrop.content';

/**
 * Fixed background layer: faint grid + drifting code fragments.
 * Parallax depth via per-item CSS variables; scroll-linked motion arrives
 * with GSAP in a later stage.
 */
export function Backdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.grid} />
      {FRAGMENTS.map((text, i) => (
        <span
          key={text}
          className={styles.fragment}
          style={{
            top: `${((i * 37 + 11) % 90) + 4}%`,
            left: `${((i * 53 + 7) % 92) + 2}%`,
            animationDelay: `${i * -3.5}s`,
            animationDuration: `${22 + (i % 5) * 6}s`,
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
}
