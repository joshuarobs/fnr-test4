import React from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Button } from '@react-monorepo/shared';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-gray-800 text-white h-[56px] flex items-center px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="mr-4 text-white hover:bg-gray-700"
      >
        <HamburgerMenuIcon className="h-5 w-5" />
      </Button>
      <h1 className="text-l font-bold">My App</h1>
    </header>
  );
};
