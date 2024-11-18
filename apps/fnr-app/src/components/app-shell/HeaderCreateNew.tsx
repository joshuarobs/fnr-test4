import React from 'react';
import { PlusIcon, CaretDownIcon } from '@radix-ui/react-icons';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

// Component for the create new button in the header
// Contains a button with plus and caret down icons
export const HeaderCreateNew = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">
            <PlusIcon className="h-4 w-4 mr-1" />
            <CaretDownIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create new...</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
