import { ItemCategory } from './itemCategories';

export type Item = {
  id: number;
  group: string;
  name: string;
  category: ItemCategory;
  modelSerialNumber?: string;
  status: 'RS' | 'NR' | 'VPOL';
  oisquote: number | null;
  ourquote: number | null;
  receiptPhotoUrl?: string; // New field for storing the receipt photo URL
  date: string;
  dueDate: string;
};

// Helper function to calculate difference
export const calculateDifference = (item: Item): number | null => {
  if (item.oisquote === null || item.ourquote === null) return null;
  return item.oisquote - item.ourquote;
};
