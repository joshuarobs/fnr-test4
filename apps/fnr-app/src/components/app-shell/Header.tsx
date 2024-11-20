import React from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Button } from '@react-monorepo/shared';
import { HeaderCreateNew } from './HeaderCreateNew';
import { HeaderNotificationsButton } from './HeaderNotificationsButton';
import { HeaderProfileButton } from './HeaderProfileButton';
import { HeaderHelpButton } from './HeaderHelpButton';

interface HeaderProps {
  onToggleSidebar: () => void;
  setIsShortcutsOpen: (isOpen: boolean) => void;
}

export const Header = ({
  onToggleSidebar,
  setIsShortcutsOpen,
}: HeaderProps) => {
  return (
    <header className="bg-gray-100 h-[56px] flex items-center px-4 border-b border-gray-200 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="mr-4 hover:bg-gray-700"
      >
        <HamburgerMenuIcon className="h-5 w-5" />
      </Button>
      <h1 className="text-l font-bold">My App</h1>
      <div className="ml-auto flex items-center gap-3 mr-3">
        <HeaderHelpButton onOpenShortcuts={() => setIsShortcutsOpen(true)} />
        <HeaderCreateNew />
        <HeaderNotificationsButton />
        <HeaderProfileButton />
      </div>
    </header>
  );
};
