export const ITEM_KEYS = {
  ID: 'id',
  GROUP: 'group',
  NAME: 'name',
  CATEGORY: 'category',
  MODEL_SERIAL_NUMBER: 'modelSerialNumber',
  ITEM_STATUS: 'itemStatus', // Changed from 'status' to 'itemStatus' to match database field
  OIS_QUOTE: 'insuredsQuote',
  OUR_QUOTE: 'ourquote',
  DIFFERENCE: 'difference',
  RECEIPT_PHOTO_URL: 'receiptPhotoUrl',
  DATE_CREATED: 'dateCreated',
  AMOUNT: 'amount',
  ACTIONS: 'actions',
} as const;
