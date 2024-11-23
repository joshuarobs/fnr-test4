export const ItemStatus = {
  RS: 'RS',
  NR: 'NR',
  VPOL: 'VPOL',
  OTHER: 'OTHER',
} as const;

// Type for ItemStatus values
export type ItemStatusType = (typeof ItemStatus)[keyof typeof ItemStatus];

// Define the standard visual order for item statuses
export const ORDERED_ITEM_STATUSES = [
  ItemStatus.NR,
  ItemStatus.VPOL,
  ItemStatus.RS,
  ItemStatus.OTHER,
] as const;
