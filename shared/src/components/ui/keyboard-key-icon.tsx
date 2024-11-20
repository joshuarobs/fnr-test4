import * as React from 'react';
import { cn } from '../../lib/utils';
import styles from './keyboard-key-icon.module.css';

// KeyboardKeyIcon: A component that renders a static keyboard key with a letter inside
export const KeyboardKeyIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    letter: string;
    width?: string;
  }
>(({ letter, className, width, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(styles.key, className)}
      style={{ ...style, width }}
      {...props}
    >
      <div className={styles.keyContent}>{letter}</div>
    </div>
  );
});

KeyboardKeyIcon.displayName = 'KeyboardKeyIcon';
