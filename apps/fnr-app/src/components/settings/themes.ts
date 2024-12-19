import React from 'react';
import { LightThemePreview } from './LightThemePreview';
import { DarkThemePreview } from './DarkThemePreview';

// Theme options for the application
// Also controls the order they are displayed in
export enum Theme {
  LIGHT = 'LIGHT',
  LIGHT_CONTRAST = 'LIGHT_CONTRAST',
  DARK = 'DARK',
  DARK_CONTRAST = 'DARK_CONTRAST',
}

// Map themes to their display names
export const themeDisplayNames: Record<Theme, string> = {
  [Theme.LIGHT]: 'Light',
  [Theme.DARK]: 'Dark',
  [Theme.LIGHT_CONTRAST]: 'Light high contrast',
  [Theme.DARK_CONTRAST]: 'Dark high contrast',
};

// Map themes to their preview components
export const themePreviewComponents: Record<Theme, React.FC> = {
  [Theme.LIGHT]: LightThemePreview,
  [Theme.DARK]: DarkThemePreview,
  [Theme.LIGHT_CONTRAST]: LightThemePreview, // Using light preview for now
  [Theme.DARK_CONTRAST]: DarkThemePreview, // Using dark preview for now
};

// Default theme when none is selected
export const DEFAULT_THEME = Theme.LIGHT;
