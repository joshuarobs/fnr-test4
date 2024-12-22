import React from 'react';
import { Button } from '@react-monorepo/shared';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/theme-provider';

// Button component that toggles between light and dark mode
export const HeaderThemeButton = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-header-hover"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-header-icon" />
      ) : (
        <Sun className="h-5 w-5 text-header-icon" />
      )}
    </Button>
  );
};
