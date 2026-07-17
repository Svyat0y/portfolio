import { SectionShell } from '@/shared/ui/section-shell';
import { skillGroups } from './skills.content';
import styles from './Skills.module.scss';

export function Skills() {
  return (
    <SectionShell id="skills" title="Skills">
      <p className={styles.lead}>
        The stack I reach for — from the interface down to the infrastructure.
      </p>

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
