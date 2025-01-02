import React from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Button } from '@react-monorepo/shared';
import { HeaderCreateNew } from './HeaderCreateNew';
import { HeaderNotificationsButton } from './HeaderNotificationsButton';
import { HeaderProfileButton } from './HeaderProfileButton';
import { HeaderHelpButton } from './HeaderHelpButton';
import { HeaderThemeButton } from './HeaderThemeButton';
import { HeaderClaimButton } from './HeaderClaimButton';
import { HeaderAdminButton } from './HeaderAdminButton';
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
    <header className="bg-header-background h-[56px] min-h-[56px] max-h-[56px] flex items-center px-4 border-b border-header-border shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="mr-4 hover:bg-header-hover"
      >
        <HamburgerMenuIcon className="h-5 w-5 text-header-icon" />
      </Button>

      <HeaderClaimButton
        style={{
          position: 'absolute',
          left: `${sidebarWidth + 16}px`, // 16px for padding
        }}
      />

      <div className="ml-auto flex items-center gap-3 mr-3">
        <HeaderAdminButton />
        <HeaderThemeButton />
        <HeaderHelpButton onOpenShortcuts={() => setIsShortcutsOpen(true)} />
        <HeaderCreateNew />
        <HeaderNotificationsButton />
        <HeaderProfileButton />
      </div>
    </header>
  );
};
