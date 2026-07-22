export const contactIntro =
  "If you'd like to make an enquiry, feel free to get in touch and I'll respond as soon as possible. My contact details are below, or send a message using the form.";

export const contactEmail = 'alexander.pop86@gmail.com';

export const contactFormText = {
  success: "// message sent - thanks, I'll get back to you soon.",
  submit: 'send message →',
  submitting: 'sending…',
  errorPrefix: 'Something went wrong - try again, or ',
  errorLink: 'email me directly',
  errorSuffix: '.',
} as const;

export const contactLinks = [
  { label: 'github', href: 'https://github.com/Svyat0y' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/alexander-pop-966697150/' },
] as const;

export const contactInfo: { label: string; value: string; href?: string }[] = [
  { label: 'email', value: contactEmail, href: `mailto:${contactEmail}` },
  { label: 'phone', value: '+34 643 099 404', href: 'tel:+34643099404' },
  { label: 'location', value: 'Valencia, Spain (CET)' },
];
