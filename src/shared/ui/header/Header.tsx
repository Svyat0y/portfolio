import { navItems, sectionOrder } from '@/shared/config';
import { useActiveSection } from '@/shared/lib/hooks';
import { ScrambleText } from '@/shared/ui/scramble-text';
import { HeaderLogo } from './HeaderLogo';
import styles from './Header.module.scss';

export function Header() {
  const { activeSection, goTo } = useActiveSection(sectionOrder);

  return (
    <header className={styles.header}>
      <HeaderLogo activeSection={activeSection} onNavigate={goTo} />

      <nav className={styles.nav} aria-label="Sections">
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.link} ${activeSection === id ? styles.active : ''}`}
            aria-current={activeSection === id ? 'location' : undefined}
            onClick={() => goTo(id)}
          >
            <ScrambleText text={label} playOnHover duration={600} />
          </button>
        ))}
      </nav>
    </header>
  );
}
