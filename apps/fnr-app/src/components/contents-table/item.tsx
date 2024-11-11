import { ItemCategory } from './itemCategories';

export type Item = {
  id: number;
  group: string;
  name: string;
  category: ItemCategory | null;
  modelSerialNumber: string | null; // Keep this as modelSerialNumber for now since it's used in many places
  status: 'RS' | 'NR' | 'VPOL';
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
