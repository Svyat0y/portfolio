import { useEffect } from 'react';
import { useScramble } from '@/shared/lib/hooks';

interface ScrambleTextProps {
  text: string;
  className?: string;
  playOnMount?: boolean;
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
      onMouseEnter={playOnHover ? play : undefined}
      onMouseLeave={playOnHover ? play : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
