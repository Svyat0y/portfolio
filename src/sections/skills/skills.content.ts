/**
 * Skills grouped by domain. Grouping (over a flat list) gives the section
 * real structure and reads as intentional rather than a chip dump.
 */
export interface SkillGroup {
  label: string;
  items: string[];
}

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
];
