import { useEffect } from 'react';
import { useScramble } from '@/shared/lib/hooks';

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** run the effect once when the component mounts (hero name) */
  playOnMount?: boolean;
  /** re-scramble on hover of the element itself (nav links) */
  playOnHover?: boolean;
  duration?: number;
}

export function ScrambleText({
  text,
  className,
  playOnMount = false,
  playOnHover = false,
  duration,
}: ScrambleTextProps) {
  const { display, play } = useScramble(text, { duration });

  useEffect(() => {
    if (playOnMount) play();
  }, [playOnMount, play]);

  return (
    <span
      className={className}
      aria-label={text}
      onMouseEnter={playOnHover ? play : undefined}
      onMouseLeave={playOnHover ? play : undefined}
    >
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
