import React from 'react';
import { Separator } from '@react-monorepo/shared';
import { SETTINGS_SUBPAGE_CONTAINER } from '../../../pages/SettingsPage';
import { LightThemePreview } from '../LightThemePreview';
import { DarkThemePreview } from '../DarkThemePreview';

// Component for customizing application appearance and theme settings
export const AppearanceSettings = () => (
  <div className={SETTINGS_SUBPAGE_CONTAINER}>
    <h2 className="text-2xl font-semibold">Appearance Settings</h2>
    <Separator className="my-4" />
    <p>Customize the look and feel of the application.</p>

    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Theme</h3>
      <div className="flex items-center gap-4">
        <LightThemePreview />
        <DarkThemePreview />
      </div>
    </div>
  </div>
);
