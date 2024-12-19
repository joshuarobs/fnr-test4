import React, { useState } from 'react';
import { Separator } from '@react-monorepo/shared';
import { SETTINGS_SUBPAGE_CONTAINER } from '../../../pages/SettingsPage';
import { LightThemePreview } from '../LightThemePreview';
import { DarkThemePreview } from '../DarkThemePreview';
import { ThemePreviewCard } from '../ThemePreviewCard';

// Component for customizing application appearance and theme settings
export const AppearanceSettings = () => {
  // State to track the currently selected theme
  const [selectedTheme, setSelectedTheme] = useState<string>('Light');

  // Handler for theme selection
  const handleThemeSelect = (theme: string) => {
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
        <div className="grid grid-cols-3 gap-4">
          <ThemePreviewCard
            themePreview={<LightThemePreview />}
            label="Light"
            selected={selectedTheme === 'Light'}
            onSelect={handleThemeSelect}
          />
          <ThemePreviewCard
            themePreview={<DarkThemePreview />}
            label="Dark"
            selected={selectedTheme === 'Dark'}
            onSelect={handleThemeSelect}
          />
        </div>
      </div>
    </div>
  );
};
