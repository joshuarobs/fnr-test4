// Theme options for the application
export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  LIGHT_CONTRAST = 'LIGHT_CONTRAST',
  DARK_CONTRAST = 'DARK_CONTRAST',
}

// Map themes to their display names
export const themeDisplayNames: Record<Theme, string> = {
  [Theme.LIGHT]: 'Light',
  [Theme.DARK]: 'Dark',
  [Theme.LIGHT_CONTRAST]: 'Light high contrast',
  [Theme.DARK_CONTRAST]: 'Dark high contrast',
};

// Default theme when none is selected
export const DEFAULT_THEME = Theme.LIGHT;
