import { useState, type FormEvent } from 'react';
import { contactEmail, contactFormText } from '../../contact.content';
import styles from './ContactForm.module.scss';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => body.append(key, String(value)));

    setStatus('submitting');
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!response.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p className={styles.success} role="status">
        {contactFormText.success}
      </p>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="contact" />
      <label className={styles.honeypot} aria-hidden="true">
        Leave this field empty
        <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>name</span>
          <input type="text" name="name" autoComplete="name" required />
        </label>
        <label className={styles.field}>
          <span>email</span>
          <input type="email" name="email" autoComplete="email" required />
        </label>
      </div>

      <label className={styles.field}>
        <span>message</span>
        <textarea name="message" rows={4} required />
      </label>

      <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
        {status === 'submitting' ? contactFormText.submitting : contactFormText.submit}
      </button>

      {status === 'error' && (
        <p className={styles.error} role="alert">
          {contactFormText.errorPrefix}
          <a href={`mailto:${contactEmail}`}>{contactFormText.errorLink}</a>
          {contactFormText.errorSuffix}
        </p>
      )}
    </form>
  );
}
