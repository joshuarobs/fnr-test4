export type Item = {
  id: string;
  group: string;
  name: string;
  category: string;
  modelSerialNumber?: string;
  status: 'RS' | 'NR' | 'VPOL';
  oisquote: number | null;
  ourquote: number;
  receiptPhotoUrl?: string; // New field for storing the receipt photo URL
  date: string;
  dueDate: string;
  amount: number;
};

// Helper function to calculate difference
export const calculateDifference = (item: Item): number | null => {
  if (item.oisquote === null) return null;
  return item.oisquote - item.ourquote;
};
