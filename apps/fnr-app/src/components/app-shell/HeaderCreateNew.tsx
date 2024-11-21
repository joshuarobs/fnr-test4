import React from 'react';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@react-monorepo/shared';
import { DropdownMenuListItem } from '../ui/DropdownMenuListItem';

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

// Component for the create new button in the header
// Contains a button with plus and caret down icons
// Uses dark grey icons and mid grey outline
// Has both tooltip and dropdown functionality
export const HeaderCreateNew = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center border border-gray-300 text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-700 px-3"
              >
                <PlusIcon />
                <CaretDownIcon />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent className="min-w-[200px]">
            <DropdownMenuListItem
              icon={<PlusIcon />}
              keyboardShortcut={['⌘', 'N']}
            >
              New claim
            </DropdownMenuListItem>
          </DropdownMenuContent>
          <TooltipContent>
            <p>Create new...</p>
          </TooltipContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};
