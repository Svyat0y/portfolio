/**
 * Global site config: identity + navigation.
 * Cross-cutting values used by more than one section (name shows in both the
 * Hero and the Header, nav drives Header + scroll targets), so it lives in
 * shared rather than in any single section.
 */

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

/** Section order for slide navigation — hero first, then every nav item. */
export const sectionOrder: SectionId[] = ['hero', ...navItems.map((item) => item.id)];
