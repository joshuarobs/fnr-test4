import React from 'react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@react-monorepo/shared';

// Component for the help button in the header
// Contains a button with question mark icon and dropdown
// Uses dark grey icons and mid grey outline
// Has both tooltip and dropdown functionality
export const HeaderHelpButton = ({
  onOpenShortcuts,
}: {
  onOpenShortcuts: () => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-600"
              >
                <QuestionMarkCircledIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onOpenShortcuts}>
              Keyboard shortcuts
            </DropdownMenuItem>
          </DropdownMenuContent>
          <TooltipContent>
            <p>Help</p>
          </TooltipContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};
