import { BackdropField } from './BackdropField';

/**
 * Fixed background layer: a generative lime constellation on near-black. The
 * cursor parts the field and reaches bright links to nearby particles. Sits at
 * z-index 0 (see `global.scss`) strictly behind all page content;
 * `prefers-reduced-motion` renders a single static frame.
 */
export function Backdrop() {
  return <BackdropField />;
}
