// Color palette for the application
export const colors = {
  // Status colors
  status: {
    error: 'text-red-500',
    success: 'text-green-600',
  },
  // Theme colors
  theme: {
    header: {
      background: 'bg-gray-100 dark:bg-gray-800',
      border: 'border-gray-200 dark:border-gray-700',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-700',
      icon: 'text-gray-700 dark:text-gray-400',
    },
  },
} as const;

// Type for the colors object
export type Colors = typeof colors;
