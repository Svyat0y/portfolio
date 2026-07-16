/** Shared glyph set for the matrix-style scramble effects (mira-festival style). */
export const SCRAMBLE_GLYPHS = '!<>-_\\/[]{}=+*^?#____';
export const SCRAMBLE_SQUARE = '█';

export function randomScrambleChar(): string {
  return Math.random() < 0.5
    ? SCRAMBLE_SQUARE
    : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
