export const ROUTES = {
  HOME: '/',
  ASSIGNED: '/assigned',
  USER: '/user/:id',
  SETTINGS: '/settings',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_APPEARANCE: '/settings/appearance',
  FEEDBACK: '/feedback',
  CLAIM: '/claim/:id',
  CREATE_CLAIM: 'new',
} as const;

// Helper function to generate claim route with ID
export const getClaimRoute = (id: string) => `/claim/${id}`;

// Helper function to generate user profile route with ID
export const getUserRoute = (id: string) => `/user/${id}`;
