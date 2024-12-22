import React from 'react';
import { DropdownMenuItem, KeyboardKeyIcon } from '@react-monorepo/shared';
import { clsx } from 'clsx';

interface DropdownMenuListItemProps {
  // Icon component to display before the text
  icon?: React.ReactNode;
  // Text content of the item
  children: React.ReactNode;
  // Optional click handler
  onClick?: () => void;
  // Optional className for custom styling
  className?: string;
  // Optional danger mode for destructive actions
  danger?: boolean;
  // Optional keyboard shortcut - array of keys for a single shortcut combination
  keyboardShortcut?: string[];
}

// Reusable dropdown menu item component with consistent styling
// Supports icons, keyboard shortcuts, custom styling, and danger mode for destructive actions
export const DropdownMenuListItem = ({
  icon,
  children,
  onClick,
  className,
  danger,
  keyboardShortcut,
}: DropdownMenuListItemProps) => {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 justify-between cursor-pointer text-muted-foreground',
        {
          'text-destructive hover:text-destructive focus:bg-destructive/10 focus:text-destructive':
            danger,
          'hover:text-foreground focus:bg-accent focus:text-accent-foreground':
            !danger,
        },
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="h-4 w-4">{icon}</span>}
        {children}
      </div>
      {keyboardShortcut && (
        <div className="ml-auto flex items-center gap-2 text-xs tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1">
            {keyboardShortcut.map((key, keyIndex) => (
              <KeyboardKeyIcon key={keyIndex} letter={key} />
            ))}
          </span>
        </div>
      )}
    </DropdownMenuItem>
  );
};
