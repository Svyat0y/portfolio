import type { PropsWithChildren, ReactNode } from 'react';
import type { SectionId } from '@/shared/config';
import { useReveal } from '@/shared/lib/hooks';
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
 */
export function SectionShell({
  id,
  title,
  aside,
  children,
}: PropsWithChildren<SectionShellProps>) {
  const mainRef = useReveal<HTMLDivElement>();
  const asideRef = useReveal<HTMLDivElement>();

  return (
    <section id={id} className="section">
      <div className={`section-inner ${styles.grid} ${aside ? styles.twoCol : ''}`}>
        <div className={styles.main} data-reveal-group ref={mainRef}>
          <h2 className={styles.title}>
            <span className="section-mark" aria-hidden="true">
              //
            </span>
            {title}
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
