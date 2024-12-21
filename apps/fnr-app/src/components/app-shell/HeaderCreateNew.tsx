import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@react-monorepo/shared';
import { DropdownMenuListItem } from '../ui/DropdownMenuListItem';
import { HeaderButton } from './HeaderButton';
import {
  GENERAL_KEYBOARD_SHORTCUTS_MAP,
  KeyboardShortcutId,
} from '../../constants/keyboard-shortcuts';

// Plus icon SVG component
const PlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mr-0.5"
  >
    <path
      d="M8 3.5V12.5M3.5 8H12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Caret down icon SVG component
const CaretDownIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.2 6.2Q4.2 6 4.4 6L11.6 6Q11.8 6 11.8 6.2Q11.8 6.3 11.7 6.4L8.2 9.8Q8.1 9.9 8 9.9Q7.9 9.9 7.8 9.8L4.3 6.4Q4.2 6.3 4.2 6.2Z"
      fill="currentColor"
    />
  </svg>
);

export const HeaderCreateNew = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <HeaderButton asChild={false} className="flex items-center px-3">
                <PlusIcon />
                <CaretDownIcon />
              </HeaderButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent className="min-w-[200px]">
            <Link to={ROUTES.CREATE_CLAIM}>
              <DropdownMenuListItem
                icon={<PlusIcon />}
                keyboardShortcut={
                  GENERAL_KEYBOARD_SHORTCUTS_MAP[
                    KeyboardShortcutId.CREATE_NEW_CLAIM
                  ].keybinds[0]
                }
              >
                New claim
              </DropdownMenuListItem>
            </Link>
          </DropdownMenuContent>
          <TooltipContent>
            <p>Create new...</p>
          </TooltipContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};
