export const ItemStatus = {
  RS: 'RS',
  NR: 'NR',
  VPOL: 'VPOL',
  OTHER: 'OTHER',
} as const;

// Type for ItemStatus values
export type ItemStatusType = (typeof ItemStatus)[keyof typeof ItemStatus];
