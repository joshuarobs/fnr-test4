import { ItemCategory } from './itemCategories';
import { ItemStatus } from './ItemStatus';

export type Item = {
  id: number;
  localId: number; // Position in localItemIds array + 1
  group: string;
  name: string;
  category: ItemCategory | null;
  modelSerialNumber: string | null; // Keep this as modelSerialNumber for now since it's used in many places
  itemStatus: (typeof ItemStatus)[keyof typeof ItemStatus]; // Using ItemStatus type
  insuredsQuote: number | null;
  ourquote: number | null;
  receiptPhotoUrl: string | null;
  ourquoteLink: string | null;
  dateCreated: Date;
};

// Helper function to calculate difference
export const calculateDifference = (item: Item): number | null => {
  if (item.insuredsQuote === null || item.ourquote === null) return null;
  return item.insuredsQuote - item.ourquote;
};
