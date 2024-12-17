export const ROUTES = {
  HOME: '/',
  ASSIGNED: '/assigned',
  SETTINGS: '/settings',
  SETTINGS_GENERAL: '/settings/general',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_PRIVACY: '/settings/privacy',
  SETTINGS_KEYBOARD: '/settings/keyboard',
  FEEDBACK: '/feedback',
  CLAIM: '/claim/:id',
} as const;

// Helper function to generate claim route with ID
export const getClaimRoute = (id: string) => `/claim/${id}`;
