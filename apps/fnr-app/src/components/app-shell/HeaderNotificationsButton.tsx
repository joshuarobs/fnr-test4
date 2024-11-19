import React from 'react';
import { BellIcon } from '@radix-ui/react-icons';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

// Component for displaying notifications button in the header
export const HeaderNotificationsButton = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-600"
          >
            <BellIcon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>You have no unread notifications</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
