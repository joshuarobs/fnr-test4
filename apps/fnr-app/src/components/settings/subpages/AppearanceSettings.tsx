import React from 'react';
import { Separator } from '@react-monorepo/shared';
import { Theme, themeDisplayNames, themePreviewComponents } from '../themes';
import { SETTINGS_SUBPAGE_CONTAINER } from '../../../pages/SettingsPage';
import { ThemePreviewCard } from '../ThemePreviewCard';
import { useTheme } from '../../providers/theme-provider';

// Component for customizing application appearance and theme settings
export const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();

  // Handler for theme selection
  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className={SETTINGS_SUBPAGE_CONTAINER}>
      <h2 className="text-2xl font-semibold">Appearance Settings</h2>
      <Separator className="my-4" />
      <p>Customize the look and feel of the application.</p>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Theme</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(Object.keys(themeDisplayNames) as Theme[]).map((themeOption) => (
            <ThemePreviewCard
              key={themeOption}
              themePreview={React.createElement(
                themePreviewComponents[themeOption]
              )}
              label={themeDisplayNames[themeOption]}
              selected={theme === themeOption}
              onSelect={() => handleThemeSelect(themeOption)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
