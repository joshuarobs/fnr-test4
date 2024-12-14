import React from 'react';
import { HamburgerMenuIcon, CaretDownIcon } from '@radix-ui/react-icons';
import { Button, Separator } from '@react-monorepo/shared';
import { HeaderCreateNew } from './HeaderCreateNew';
import { HeaderNotificationsButton } from './HeaderNotificationsButton';
import { HeaderProfileButton } from './HeaderProfileButton';
import { HeaderHelpButton } from './HeaderHelpButton';
import { SIDEBAR_WIDTHS } from '../../constants/layout-constants';

interface HeaderProps {
  onToggleSidebar: () => void;
  setIsShortcutsOpen: (isOpen: boolean) => void;
  isSidebarExpanded: boolean;
}

export const Header = ({
  onToggleSidebar,
  setIsShortcutsOpen,
  isSidebarExpanded,
}: HeaderProps) => {
  const sidebarWidth = isSidebarExpanded
    ? SIDEBAR_WIDTHS.EXPANDED
    : SIDEBAR_WIDTHS.MINIMIZED;

  return (
    <header className="bg-gray-100 h-[56px] min-h-[56px] max-h-[56px] flex items-center px-4 border-b border-gray-200 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="mr-4 hover:bg-gray-700"
      >
        <HamburgerMenuIcon className="h-5 w-5" />
      </Button>

      <div
        style={{
          position: 'absolute',
          left: `${sidebarWidth + 16}px`, // 16px for padding
        }}
      >
        <Button
          variant="outline"
          className="flex items-center gap-2 border border-gray-300 text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-700 px-3"
        >
          Claim
          <Separator orientation="vertical" className="h-4" />
          <CaretDownIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-3 mr-3">
        <HeaderHelpButton onOpenShortcuts={() => setIsShortcutsOpen(true)} />
        <HeaderCreateNew />
        <HeaderNotificationsButton />
        <HeaderProfileButton />
      </div>
    </header>
  );
};
