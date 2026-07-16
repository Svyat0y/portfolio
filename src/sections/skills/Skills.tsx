import { SectionShell } from '@/shared/ui/section-shell';
import { skills } from './skills.content';
import styles from './Skills.module.scss';

export function Skills() {
  return (
    <SectionShell id="skills" index={2} title="Skills">
      <p className={styles.note}>// interactive glass bowl — stage 2</p>
      <ul className={styles.chips}>
        {skills.map(({ label }) => (
          <li key={label} className={styles.chip}>
            {label}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
