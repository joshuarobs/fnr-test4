import React from 'react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Keyboard } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  KeyboardKeyIcon,
} from '@react-monorepo/shared';
import { HeaderIconButton } from './HeaderButton';

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
              <HeaderIconButton asChild={false}>
                <QuestionMarkCircledIcon className="h-5 w-5" />
              </HeaderIconButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuItem onClick={onOpenShortcuts}>
              <Keyboard className="mr-1 h-4 w-4" />
              <span>Keyboard shortcuts</span>
              <div className="ml-auto">
                <KeyboardKeyIcon letter="?" />
              </div>
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
