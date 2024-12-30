export const ROUTES = {
  HOME: '/',
  ASSIGNED: '/assigned',
  HISTORY: '/history',
  STAFF: '/staff/:employeeId',
  SETTINGS: '/settings',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_APPEARANCE: '/settings/appearance',
  FEEDBACK: '/feedback',
  CLAIM: '/claim/:id',
  CREATE_CLAIM: 'new',
} as const;

// Helper function to generate claim route with ID
export const getClaimRoute = (id: string) => `/claim/${id}`;

// Helper function to generate staff profile route with employee ID
export const getStaffRoute = (employeeId: string) => `/staff/${employeeId}`;
