import { identity, type SectionId } from '@/shared/config';
import { useInfiniteScramble } from '@/shared/lib/hooks';
import styles from './Header.module.scss';

interface HeaderLogoProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

export function HeaderLogo({ activeSection, onNavigate }: HeaderLogoProps) {
  const nameDisplay = useInfiniteScramble(identity.name, { active: activeSection === 'hero' });

  return (
    <button className={styles.logo} onClick={() => onNavigate('hero')} aria-label={identity.name}>
      <span aria-hidden="true">{nameDisplay}</span>
    </button>
  );
}
