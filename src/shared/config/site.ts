export type SectionId = 'hero' | 'about' | 'skills' | 'projects' | 'contact';

export const identity = {
  name: 'Alexander Pop',
  role: 'Software Engineer',
  tagline: 'Building full-stack web apps with React, Node.js & TypeScript.',
} as const;

export const navItems: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'about' },
  { id: 'skills', label: 'skills' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' },
];

export const sectionOrder: SectionId[] = ['hero', ...navItems.map((item) => item.id)];
