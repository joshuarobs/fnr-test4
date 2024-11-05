import { ItemCategory } from './itemCategories';

export type Item = {
  id: number;
  group: string;
  name: string;
  category: ItemCategory | null;
  modelSerialNumber: string | null;
  status: 'RS' | 'NR' | 'VPOL';
  oisquote: number | null;
  ourquote: number | null;
  receiptPhotoUrl: string | null;
  ourquoteLink: string | null;
  date: string;
  dueDate: string;
};

// Helper function to calculate difference
export const calculateDifference = (item: Item): number | null => {
  if (item.oisquote === null || item.ourquote === null) return null;
  return item.oisquote - item.ourquote;
};
