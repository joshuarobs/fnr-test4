export const ROUTES = {
  HOME: '/',
  ASSIGNED: '/assigned',
  SETTINGS: '/settings',
  FEEDBACK: '/feedback',
  CLAIM: '/claim/:id',
} as const;

// Helper function to generate claim route with ID
export const getClaimRoute = (id: string) => `/claim/${id}`;
