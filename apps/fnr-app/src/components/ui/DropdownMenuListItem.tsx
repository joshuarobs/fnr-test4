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
        'flex items-center gap-2 justify-between',
        {
          'text-red-600 focus:bg-red-100 focus:text-red-600': danger,
          'text-gray-600 focus:bg-gray-100 focus:text-gray-700': !danger,
        },
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="h-4 w-4">{icon}</span>}
        {children}
      </div>
      {keyboardShortcut && (
        <div className="ml-auto flex items-center gap-2 text-xs tracking-widest text-gray-400">
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
