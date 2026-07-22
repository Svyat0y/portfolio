export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillsLead = 'The stack I reach for - from the interface down to the infrastructure.';

export const skillGroups: SkillGroup[] = [
  {
    label: 'Frontend',
    items: [
      'React.js',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'HTML/CSS/SCSS',
      'Tailwind CSS',
      'Styled Components',
    ],
  },
  {
    label: 'Backend & APIs',
    items: ['Node.js', 'NestJS', 'Express', 'GraphQL', 'REST APIs'],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'MongoDB'],
  },
  {
    label: 'Testing & CI',
    items: ['Cypress', 'Puppeteer', 'CI/CD', 'Git'],
  },
  {
    label: 'CMS',
    items: ['Strapi', 'WordPress'],
  },
  {
    label: 'languages',
    items: ['Russian/Ukrainian - native', 'English - B1', 'Spanish - A1'],
  },
];
