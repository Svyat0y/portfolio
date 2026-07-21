import { SectionShell } from '@/shared/ui/section-shell';
import { skillGroups, skillsLead } from './skills.content';
import styles from './Skills.module.scss';

export function Skills() {
  return (
    <SectionShell id="skills" title="Skills">
      <p className={styles.lead}>{skillsLead}</p>

      <dl className={styles.groups}>
        {skillGroups.map(({ label, items }) => (
          <div key={label} className={styles.group}>
            <dt className={styles.groupLabel}>{label}</dt>
            <dd className={styles.groupItems}>
              {items.map((item) => (
                <span key={item} className={styles.item}>
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
