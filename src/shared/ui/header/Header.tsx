import { identity, navItems, type SectionId } from '@/shared/config';
import { ScrambleText } from '@/shared/ui/scramble-text';
import { useInfiniteScramble } from '@/shared/lib/hooks';
import styles from './Header.module.scss';

interface HeaderProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

export function Header({ activeSection, onNavigate }: HeaderProps) {
  // shuffles endlessly while Hero is in view (where the real name already
  // shows big), settles into the real name once you scroll past it
  const nameDisplay = useInfiniteScramble(identity.name, { active: activeSection === 'hero' });

  return (
    <header className={styles.header}>
      <button className={styles.logo} onClick={() => onNavigate('hero')} aria-label={identity.name}>
        <span aria-hidden="true">{nameDisplay}</span>
      </button>

      <nav className={styles.nav} aria-label="Sections">
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.link} ${activeSection === id ? styles.active : ''}`}
            onClick={() => onNavigate(id)}
          >
            <ScrambleText text={label} playOnHover duration={600} />
          </button>
        ))}
      </nav>
    </header>
  );
}
