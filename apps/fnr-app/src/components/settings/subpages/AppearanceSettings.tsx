import React, { useState } from 'react';
import { Separator } from '@react-monorepo/shared';
import { Theme, themeDisplayNames, themePreviewComponents } from '../themes';
import { SETTINGS_SUBPAGE_CONTAINER } from '../../../pages/SettingsPage';
import { ThemePreviewCard } from '../ThemePreviewCard';

// Component for customizing application appearance and theme settings
export const AppearanceSettings = () => {
  // State to track the currently selected theme
  const [selectedTheme, setSelectedTheme] = useState<Theme>(Theme.LIGHT);

  // Handler for theme selection
  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    // TODO: Add logic to actually change the theme in the app
  };

  return (
    <div className={SETTINGS_SUBPAGE_CONTAINER}>
      <h2 className="text-2xl font-semibold">Appearance Settings</h2>
      <Separator className="my-4" />
      <p>Customize the look and feel of the application.</p>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Theme</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(Theme).map((theme) => (
            <ThemePreviewCard
              key={theme}
              themePreview={React.createElement(themePreviewComponents[theme])}
              label={themeDisplayNames[theme]}
              selected={selectedTheme === theme}
              onSelect={() => handleThemeSelect(theme)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
