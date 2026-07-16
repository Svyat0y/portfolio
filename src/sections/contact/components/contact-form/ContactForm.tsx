import { useState, type FormEvent } from 'react';
import styles from './ContactForm.module.scss';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Submits to Netlify Forms via a plain fetch (no backend of our own).
 * Netlify's build bot detects the matching static form in index.html and
 * wires this one up automatically — see the comment there for details.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      payload[key] = String(value);
    });

    setStatus('submitting');
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });
      if (!response.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <p className={styles.success}>// message sent — thanks, I'll get back to you soon.</p>;
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
          <input type="text" name="name" required />
        </label>
        <label className={styles.field}>
          <span>email</span>
          <input type="email" name="email" required />
        </label>
      </div>

      <label className={styles.field}>
        <span>message</span>
        <textarea name="message" rows={4} required />
      </label>

      <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'sending…' : 'send message →'}
      </button>

      {status === 'error' && (
        <p className={styles.error}>Something went wrong — try again, or email me directly.</p>
      )}
    </form>
  );
}
