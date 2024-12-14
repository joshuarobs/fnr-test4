import React from 'react';
import { BellIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';
import { HeaderIconButton } from './HeaderButton';

export const HeaderNotificationsButton = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HeaderIconButton asChild={false}>
            <BellIcon className="h-5 w-5" />
          </HeaderIconButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>You have no unread notifications</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
