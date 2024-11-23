export const ITEM_KEYS = {
  ID: 'id',
  LOCAL_ID: 'localId',
  ROOM_CATEGORY: 'roomCategory', // Renamed from GROUP to ROOM_CATEGORY
  NAME: 'name',
  CATEGORY: 'category',
  MODEL_SERIAL_NUMBER: 'modelSerialNumber',
  ITEM_STATUS: 'itemStatus', // Changed from 'status' to 'itemStatus' to match database field
  OIS_QUOTE: 'insuredsQuote',
  OUR_QUOTE: 'ourQuote', // Fixed casing to match database and Item interface
  DIFFERENCE: 'difference',
  RECEIPT_PHOTO_URL: 'receiptPhotoUrl',
  DATE_CREATED: 'dateCreated',
  AMOUNT: 'amount',
  ACTIONS: 'actions',
} as const;
