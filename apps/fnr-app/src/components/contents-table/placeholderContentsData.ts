import { Item } from './item';
import { ItemCategory } from './itemCategories';
import { ItemStatus } from './ItemStatus';
import { RoomCategory } from './roomCategories';

export const placeholderContentsData: Item[] = [
  {
    id: 1,
    name: 'Laptop',
    category: ItemCategory.ELECTRONICS,
    modelSerialNumber: 'LT-2023-XPS15',
    dateCreated: new Date('2023-05-01T14:23:45'),
    itemStatus: ItemStatus.RS,
    roomCategory: RoomCategory.OFFICE_STUDY,
    insuredsQuote: 2000,
    ourQuote: 1500,
    receiptPhotoUrl: 'https://example.com/receipts/laptop.jpg',
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 2,
    name: 'Office Desk',
    category: null,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-02T09:15:30'),
    itemStatus: ItemStatus.NR,
    roomCategory: RoomCategory.OFFICE_STUDY,
    insuredsQuote: 2000,
    ourQuote: 2300,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 3,
    name: 'Antivirus License Very Very Very Very Long Value',
    category: ItemCategory.DIGITAL,
    modelSerialNumber: 'AV-2023-PRO',
    dateCreated: new Date('2023-05-03T16:45:12'),
    itemStatus: ItemStatus.VPOL,
    roomCategory: null,
    insuredsQuote: null,
    ourQuote: 1800,
    receiptPhotoUrl: 'https://example.com/receipts/antivirus.jpg',
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 4,
    name: 'Smartphone',
    category: ItemCategory.ELECTRONICS,
    modelSerialNumber: 'SM-G-S23-ULTRA',
    dateCreated: new Date('2023-05-04T11:32:58'),
    itemStatus: ItemStatus.RS,
    roomCategory: RoomCategory.OTHER,
    insuredsQuote: 1600,
    ourQuote: 1200,
    receiptPhotoUrl: 'https://example.com/receipts/smartphone.jpg',
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 5,
    name: 'Groceries',
    category: ItemCategory.FOOD,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-05T08:05:22'),
    itemStatus: ItemStatus.NR,
    roomCategory: null,
    insuredsQuote: 155,
    ourQuote: 0,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 6,
    name: 'Area Rug',
    category: ItemCategory.DECOR,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-06T13:48:33'),
    itemStatus: ItemStatus.NR,
    roomCategory: RoomCategory.LIVING_ROOM,
    insuredsQuote: 500,
    ourQuote: null,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 7,
    name: 'Coffee Maker',
    category: ItemCategory.APPLIANCES,
    modelSerialNumber: 'CM-2023-DELUXE',
    dateCreated: new Date('2023-05-07T15:20:15'),
    itemStatus: ItemStatus.RS,
    roomCategory: RoomCategory.KITCHEN_DINING,
    insuredsQuote: 300.75,
    ourQuote: 250,
    receiptPhotoUrl: 'https://example.com/receipts/coffeemaker.jpg',
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 8,
    name: 'Office Chair',
    category: ItemCategory.FURNITURE,
    modelSerialNumber: 'OC-2023-ERGO',
    dateCreated: new Date('2023-05-08T10:55:42'),
    itemStatus: ItemStatus.NR,
    roomCategory: null,
    insuredsQuote: 400,
    ourQuote: null,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 9,
    name: 'Printer',
    category: null,
    modelSerialNumber: 'PR-2023-LASER',
    dateCreated: new Date('2023-05-09T17:08:19'),
    itemStatus: ItemStatus.VPOL,
    roomCategory: null,
    insuredsQuote: null,
    ourQuote: 350,
    receiptPhotoUrl: 'https://example.com/receipts/printer.jpg',
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 10,
    name: 'Bookshelf',
    category: ItemCategory.FURNITURE,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-10T12:30:55'),
    itemStatus: ItemStatus.NR,
    roomCategory: RoomCategory.BEDROOM_1,
    insuredsQuote: 180,
    ourQuote: 180,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 11,
    name: 'Microwave',
    category: ItemCategory.APPLIANCES,
    modelSerialNumber: 'MW-2023-SMART',
    dateCreated: new Date('2023-05-11T09:42:28'),
    itemStatus: ItemStatus.RS,
    roomCategory: null,
    insuredsQuote: 250,
    ourQuote: 200,
    receiptPhotoUrl: 'https://example.com/receipts/microwave.jpg',
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 12,
    name: 'Dining Table',
    category: ItemCategory.FURNITURE,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-12T14:15:37'),
    itemStatus: ItemStatus.NR,
    roomCategory: null,
    insuredsQuote: 750,
    ourQuote: 800,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 13,
    name: 'Vacuum Cleaner',
    category: ItemCategory.APPLIANCES,
    modelSerialNumber: 'VC-2023-ROBOT',
    dateCreated: new Date('2023-05-13T16:28:51'),
    itemStatus: ItemStatus.VPOL,
    roomCategory: null,
    insuredsQuote: null,
    ourQuote: 400,
    receiptPhotoUrl: 'https://example.com/receipts/vacuum.jpg',
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 14,
    name: 'Television',
    category: ItemCategory.ELECTRONICS,
    modelSerialNumber: 'TV-2023-4K',
    dateCreated: new Date('2023-05-14T11:05:44'),
    itemStatus: ItemStatus.RS,
    roomCategory: null,
    insuredsQuote: 1200,
    ourQuote: 1000,
    receiptPhotoUrl: 'https://example.com/receipts/television.jpg',
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 15,
    name: 'Blender',
    category: ItemCategory.APPLIANCES,
    modelSerialNumber: 'BL-2023-PRO',
    dateCreated: new Date('2023-05-15T13:37:09'),
    itemStatus: ItemStatus.NR,
    roomCategory: null,
    insuredsQuote: 120,
    ourQuote: 120,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 16,
    name: 'Curtains',
    category: ItemCategory.DECOR,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-16T15:52:23'),
    itemStatus: ItemStatus.NR,
    roomCategory: null,
    insuredsQuote: 150,
    ourQuote: 150,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 17,
    name: 'Car Battery',
    category: ItemCategory.AUTO,
    modelSerialNumber: 'CB-2023-12V',
    dateCreated: new Date('2023-05-17T08:45:31'),
    itemStatus: ItemStatus.NR,
    roomCategory: RoomCategory.GARAGE,
    insuredsQuote: 200,
    ourQuote: 180,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 18,
    name: 'Bath towel',
    category: ItemCategory.BATH,
    modelSerialNumber: '',
    dateCreated: new Date('2023-05-18T10:18:47'),
    itemStatus: ItemStatus.RS,
    roomCategory: RoomCategory.BATHROOM,
    insuredsQuote: 150,
    ourQuote: 120,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 19,
    name: 'Leather Jacket',
    category: ItemCategory.CLOTHING,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-19T12:25:56'),
    itemStatus: ItemStatus.NR,
    roomCategory: RoomCategory.STORAGE,
    insuredsQuote: 300,
    ourQuote: 280,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 20,
    name: 'Insurance Papers',
    category: ItemCategory.DOCUMENTS,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-20T14:40:15'),
    itemStatus: ItemStatus.VPOL,
    roomCategory: RoomCategory.OFFICE_STUDY,
    insuredsQuote: null,
    ourQuote: 50,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 21,
    name: 'Lawn Mower',
    category: ItemCategory.GARDEN,
    modelSerialNumber: 'LM-2023-ELECTRIC',
    dateCreated: new Date('2023-05-21T09:33:28'),
    itemStatus: ItemStatus.RS,
    roomCategory: RoomCategory.GARDEN,
    insuredsQuote: 600,
    ourQuote: 550,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 22,
    name: 'Lego Toys',
    category: ItemCategory.KIDS,
    modelSerialNumber: 'BC-2023-SAFE',
    dateCreated: new Date('2023-05-22T11:50:42'),
    itemStatus: ItemStatus.NR,
    roomCategory: RoomCategory.BEDROOM_2,
    insuredsQuote: 400,
    ourQuote: 380,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 23,
    name: 'Miscellaneous Items Box',
    category: ItemCategory.OTHER,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-23T16:15:39'),
    itemStatus: ItemStatus.NR,
    roomCategory: RoomCategory.STORAGE,
    insuredsQuote: 200,
    ourQuote: 180,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 24,
    name: 'Dog Bed',
    category: ItemCategory.PETS,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-24T13:28:54'),
    itemStatus: ItemStatus.RS,
    roomCategory: RoomCategory.OTHER,
    insuredsQuote: 80,
    ourQuote: 70,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 25,
    name: 'Tennis Racket',
    category: ItemCategory.RECREATION,
    modelSerialNumber: 'TR-2023-PRO',
    dateCreated: new Date('2023-05-25T15:45:17'),
    itemStatus: ItemStatus.NR,
    roomCategory: RoomCategory.STORAGE,
    insuredsQuote: 250,
    ourQuote: 220,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 26,
    name: 'Storage Cabinet',
    category: ItemCategory.STORAGE,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-26T10:12:33'),
    itemStatus: ItemStatus.RS,
    roomCategory: RoomCategory.GARAGE,
    insuredsQuote: 350,
    ourQuote: 320,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 27,
    name: 'Cleaning Supplies Set',
    category: ItemCategory.SUPPLIES,
    modelSerialNumber: null,
    dateCreated: new Date('2023-05-27T08:55:48'),
    itemStatus: ItemStatus.NR,
    roomCategory: RoomCategory.LAUNDRY,
    insuredsQuote: 120,
    ourQuote: 100,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
  {
    id: 28,
    name: 'Power Drill',
    category: ItemCategory.TOOLS,
    modelSerialNumber: 'PD-2023-18V',
    dateCreated: new Date('2023-05-28T12:40:25'),
    itemStatus: ItemStatus.RS,
    roomCategory: RoomCategory.GARAGE,
    insuredsQuote: 180,
    ourQuote: 160,
    receiptPhotoUrl: null,
    ourQuoteProof: null,
    localId: 0,
  },
];
