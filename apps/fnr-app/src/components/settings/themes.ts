import React from 'react';
import { LightThemePreview } from './LightThemePreview';
import { DarkThemePreview } from './DarkThemePreview';

// Theme options for the application
export type Theme = 'light' | 'dark' | 'system';

// Map themes to their display names
export const themeDisplayNames: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

// Map themes to their preview components
export const themePreviewComponents: Record<Theme, React.FC> = {
  light: LightThemePreview,
  dark: DarkThemePreview,
  system: LightThemePreview, // Using light preview for system
};

// Default theme when none is selected
export const DEFAULT_THEME: Theme = 'system';
