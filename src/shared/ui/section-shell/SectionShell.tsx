import type { PropsWithChildren, ReactNode } from 'react';
import type { SectionId } from '@/shared/config';
import { useReveal, useSlideActive } from '@/shared/lib/hooks';
import { ScrambleText } from '@/shared/ui/scramble-text';
import styles from './SectionShell.module.scss';

interface SectionShellProps {
  id: SectionId;
  title: string;
  aside?: ReactNode;
}

export function SectionShell({ id, title, aside, children }: PropsWithChildren<SectionShellProps>) {
  const headerRef = useReveal<HTMLDivElement>();
  const mainRef = useReveal<HTMLDivElement>();
  const asideRef = useReveal<HTMLDivElement>();
  const { ref: sectionRef, activations } = useSlideActive<HTMLElement>();

  return (
    <section id={id} className="section" ref={sectionRef}>
      <div className="section-inner">
        <div className={styles.header} data-reveal-group ref={headerRef}>
          <h2 className={styles.title}>
            <span className="section-mark" aria-hidden="true">
              //
            </span>
            <ScrambleText key={activations} text={title} playOnMount duration={600} />
          </h2>
        </div>

        <div className={`${styles.grid} ${aside ? styles.twoCol : ''}`}>
          <div className={styles.main} data-reveal-group ref={mainRef}>
            {children}
          </div>
          {aside && (
            <div className={styles.aside} data-reveal-group ref={asideRef}>
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
