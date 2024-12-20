import React, { useState } from 'react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Keyboard } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  KeyboardKeyIcon,
} from '@react-monorepo/shared';
import { HeaderIconButton } from './HeaderButton';
import { DropdownMenuListItem } from '../ui/DropdownMenuListItem';
import {
  GENERAL_KEYBOARD_SHORTCUTS_MAP,
  KeyboardShortcutId,
} from '../../constants/keyboard-shortcuts';

export const HeaderHelpButton = ({
  onOpenShortcuts,
}: {
  onOpenShortcuts: () => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOpenShortcuts = () => {
    setIsDropdownOpen(false); // Close dropdown when opening shortcuts
    onOpenShortcuts();
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <HeaderIconButton asChild={false}>
                <QuestionMarkCircledIcon className="h-5 w-5" />
              </HeaderIconButton>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuListItem
              icon={<Keyboard className="h-4 w-4" />}
              onClick={handleOpenShortcuts}
              keyboardShortcut={
                GENERAL_KEYBOARD_SHORTCUTS_MAP[
                  KeyboardShortcutId.VIEW_KEYBOARD_SHORTCUTS
                ].keybinds[0]
              }
            >
              Keyboard shortcuts
            </DropdownMenuListItem>
          </DropdownMenuContent>
          <TooltipContent>
            <p>Help</p>
          </TooltipContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
};
