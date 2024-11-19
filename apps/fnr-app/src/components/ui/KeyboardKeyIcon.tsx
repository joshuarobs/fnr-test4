import * as React from 'react';
import { cn } from 'shared/src/lib/utils';
import styles from './KeyboardKeyIcon.module.css';

// KeyboardKeyIcon: A component that renders a static keyboard key with a letter inside
export const KeyboardKeyIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    letter: string;
  }
>(({ letter, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(styles.key, className)} {...props}>
      {letter}
    </div>
  );
});

KeyboardKeyIcon.displayName = 'KeyboardKeyIcon';
