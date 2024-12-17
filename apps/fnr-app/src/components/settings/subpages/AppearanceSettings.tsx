import React from 'react';
import { Separator } from '@react-monorepo/shared';
import { SETTINGS_SUBPAGE_CONTAINER } from '../../../pages/SettingsPage';

// Component for customizing application appearance and theme settings
export const AppearanceSettings = () => (
  <div className={SETTINGS_SUBPAGE_CONTAINER}>
    <h2 className="text-2xl font-semibold">Appearance Settings</h2>
    <Separator className="my-4" />
    <p>Customize the look and feel of the application.</p>
  </div>
);
