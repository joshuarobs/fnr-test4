import { ItemCategory } from './itemCategories';
import { ItemStatus } from './ItemStatus';
import { RoomCategory } from './roomCategories';

export type Item = {
  id: number;
  localId: number; // Position in localItemIds array + 1
  group: string;
  name: string;
  category: ItemCategory | null;
  roomcategory: RoomCategory | null; // Added room category field
  modelSerialNumber: string | null; // Keep this as modelSerialNumber for now since it's used in many places
  itemStatus: (typeof ItemStatus)[keyof typeof ItemStatus]; // Using ItemStatus type
  insuredsQuote: number | null;
  ourQuote: number | null; // Fixed casing to match database schema
  receiptPhotoUrl: string | null;
  ourQuoteProof: string | null; // Updated to match database schema
  dateCreated: Date;
};

// Helper function to calculate difference
export const calculateDifference = (item: Item): number | null => {
  if (item.insuredsQuote === null || item.ourQuote === null) return null;
  return item.insuredsQuote - item.ourQuote;
};
