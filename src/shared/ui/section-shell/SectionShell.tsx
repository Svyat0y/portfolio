import type { PropsWithChildren, ReactNode } from 'react';
import type { SectionId } from '@/shared/config';
import styles from './SectionShell.module.scss';

interface SectionShellProps {
  id: SectionId;
  /** display index shown as "01 / TITLE" */
  index: number;
  title: string;
  /** right-hand column: a visual, interactive element, or form. Omit for a
   * single-column section. Present → two-column layout on wide screens. */
  aside?: ReactNode;
}

/**
 * Full-screen section shell with the "NN / TITLE" heading, centered in a
 * shared max-width container so content stays balanced instead of hugging the
 * left gutter. Optionally lays out a right-hand `aside` column.
 */
export function SectionShell({
  id,
  index,
  title,
  aside,
  children,
}: PropsWithChildren<SectionShellProps>) {
  return (
    <section id={id} className="section">
      <div className={`section-inner ${styles.grid} ${aside ? styles.twoCol : ''}`}>
        <div className={styles.main}>
          <p className="section-label">
            {String(index).padStart(2, '0')} / {title}
          </p>
          <h2 className={styles.title}>{title}</h2>
          {children}
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
    </section>
  );
}
