export const ROUTES = {
  // Admin routes
  ADMIN_PORTAL: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SUPPLIERS: '/admin/suppliers',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',

  // Auth routes
  LOGIN: '/login',
  SIGN_UP: '/signup',
  HOME: '/',
  ASSIGNED: '/assigned',
  HISTORY: '/history',
  STAFF: '/staff/:employeeId',
  SUPPLIER: '/supplier/:supplierId',
  SETTINGS: '/settings',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_APPEARANCE: '/settings/appearance',
  FEEDBACK: '/feedback',
  CLAIM: '/claim/:id',
  CREATE_CLAIM: 'new',
  LOGOUT: '/logout',
} as const;

// Helper function to generate claim route with ID
export const getClaimRoute = (id: string) => `/claim/${id}`;

// Helper function to generate staff profile route with employee ID
export const getStaffRoute = (employeeId: string) => `/staff/${employeeId}`;

// Helper function to generate supplier profile route with supplier ID
export const getSupplierRoute = (supplierId: string) =>
  `/supplier/${supplierId}`;
