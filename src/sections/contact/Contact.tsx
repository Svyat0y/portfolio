import { SectionShell } from '@/shared/ui/section-shell';
import { ContactForm } from './components/contact-form';
import { contactInfo, contactIntro, contactLinks } from './contact.content';
import { GithubIcon, LinkedinIcon } from './social-icons';
import styles from './Contact.module.scss';

const ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
} as const;

export function Contact() {
  return (
    <SectionShell id="contact" title="Contact" aside={<ContactForm />}>
      <p className={styles.intro}>{contactIntro}</p>

      <dl className={styles.info}>
        {contactInfo.map(({ label, value, href }) => (
          <div key={label} className={styles.infoRow}>
            <dt className={styles.infoLabel}>{label}</dt>
            <dd className={styles.infoValue}>{href ? <a href={href}>{value}</a> : value}</dd>
          </div>
        ))}
      </dl>

      <ul className={styles.links}>
        {contactLinks.map(({ label, href }) => {
          const Icon = ICONS[label];
          return (
            <li key={label}>
              <a className="pill-link" href={href} target="_blank" rel="noreferrer">
                <Icon className={styles.icon} />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
