export const SCRAMBLE_GLYPHS = '!<>-_\\/[]{}=+*^?#____';
export const SCRAMBLE_SQUARE = '█';

export function randomScrambleChar(): string {
  return Math.random() < 0.5
    ? SCRAMBLE_SQUARE
    : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
}

export function startResolve(
  text: string,
  duration: number,
  tickMs: number,
  onFrame: (frame: string) => void,
): () => void {
  const totalTicks = Math.max(2, Math.round(duration / tickMs));
  const lockAt = Array.from({ length: text.length }, () =>
    Math.floor(totalTicks * (0.25 + Math.random() * 0.75)),
  );
  let tick = 0;

  const id = window.setInterval(() => {
    tick += 1;
    let out = '';
    let done = true;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      if (ch === ' ' || tick >= lockAt[i]) {
        out += ch;
      } else {
        done = false;
        out += randomScrambleChar();
      }
    }
    onFrame(out);
    if (done) window.clearInterval(id);
  }, tickMs);

  return () => window.clearInterval(id);
}
