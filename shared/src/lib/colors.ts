// Color palette for the application
export const colors = {
  // Status colors
  status: {
    error: 'text-red-500',
    success: 'text-green-600',
  },
} as const;

// Type for the colors object
export type Colors = typeof colors;
