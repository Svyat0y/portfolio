import type { PropsWithChildren, ReactNode } from 'react';
import type { SectionId } from '@/shared/config';
import { useReveal, useSlideActive } from '@/shared/lib/hooks';
import { ScrambleText } from '@/shared/ui/scramble-text';
import styles from './SectionShell.module.scss';

interface SectionShellProps {
  id: SectionId;
  title: string;
  /** right-hand column: a visual, interactive element, or form. Omit for a
   * single-column section. Present → two-column layout on wide screens. */
  aside?: ReactNode;
}

/**
 * Full-screen section shell with a "// TITLE" heading, centered in a shared
 * max-width container so content stays balanced instead of hugging the left
 * gutter. Optionally lays out a right-hand `aside` column.
 *
 * The title re-scrambles every time the section becomes the active slide
 * (see `useSlideActive`) — keying `ScrambleText` on `activations` remounts
 * it, replaying its own `playOnMount` effect (the same remount-for-replay
 * trick already used for the Projects list↔detail `dive` transition).
 */
export function SectionShell({ id, title, aside, children }: PropsWithChildren<SectionShellProps>) {
  const mainRef = useReveal<HTMLDivElement>();
  const asideRef = useReveal<HTMLDivElement>();
  const { ref: sectionRef, activations } = useSlideActive<HTMLElement>();

  return (
    <section id={id} className="section" ref={sectionRef}>
      <div className={`section-inner ${styles.grid} ${aside ? styles.twoCol : ''}`}>
        <div className={styles.main} data-reveal-group ref={mainRef}>
          <h2 className={styles.title}>
            <span className="section-mark" aria-hidden="true">
              //
            </span>
            <ScrambleText key={activations} text={title} playOnMount duration={600} />
          </h2>
          {children}
        </div>
        {aside && (
          <div className={styles.aside} data-reveal-group ref={asideRef}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
