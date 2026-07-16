export const contactIntro =
  "If you'd like to make an enquiry, feel free to get in touch and I'll respond as soon as possible. My contact details are below, or send a message using the form.";

export const contactLinks = [
  { label: 'github', href: 'https://github.com/Svyat0y' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/alexander-pop-966697150/' },
] as const;

export const contactInfo: { label: string; value: string; href?: string }[] = [
  { label: 'email', value: 'alexander.pop86@gmail.com', href: 'mailto:alexander.pop86@gmail.com' },
  { label: 'phone', value: '+34 643 099 404', href: 'tel:+34643099404' },
  { label: 'location', value: 'Valencia, Spain (CET)' },
];
