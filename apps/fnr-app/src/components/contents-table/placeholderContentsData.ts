import { Item } from './item';
import { ItemCategory } from './itemCategories';

export const placeholderContentsData: Item[] = [
  {
    id: 1,
    name: 'Laptop',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'LT-2023-XPS15',
    date: '2023-05-01',
    dueDate: '2023-05-15',
    status: 'RS',
    group: 'Home Office',
    oisquote: 2000, // Overinflated
    ourquote: 1500,
    receiptPhotoUrl: 'https://example.com/receipts/laptop.jpg',
  },
  {
    id: 2,
    name: 'Office Desk',
    category: ItemCategory.Furniture,
    date: '2023-05-05',
    dueDate: '2023-05-19',
    status: 'NR',
    group: 'Home Office',
    oisquote: 2000, // Under-inflated
    ourquote: 2300,
  },
  {
    id: 3,
    name: 'Antivirus License Very Very Very Very Long Value',
    category: ItemCategory.Digital,
    modelSerialNumber: 'AV-2023-PRO',
    date: '2023-04-15',
    dueDate: '2023-04-29',
    status: 'VPOL',
    group: '',
    oisquote: null, // Missing
    ourquote: 1800,
    receiptPhotoUrl: 'https://example.com/receipts/antivirus.jpg',
  },
  {
    id: 4,
    name: 'Smartphone',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'SM-G-S23-ULTRA',
    date: '2023-06-01',
    dueDate: '2023-06-15',
    status: 'RS',
    group: 'Very Very Very Very Long Value',
    oisquote: 1600, // Overinflated
    ourquote: 1200,
    receiptPhotoUrl: 'https://example.com/receipts/smartphone.jpg',
  },
  {
    id: 5,
    name: 'Groceries',
    category: ItemCategory.Food,
    date: '2023-06-10',
    dueDate: '2023-06-24',
    status: 'NR',
    group: '',
    oisquote: 155, // Fair
    ourquote: 0,
  },
  {
    id: 6,
    name: 'Area Rug',
    category: ItemCategory.Decor,
    date: '2023-06-15',
    dueDate: '2023-06-29',
    status: 'NR',
    group: 'Loungeroom',
    oisquote: 500, // Same as ourquote
    ourquote: null,
  },
  {
    id: 7,
    name: 'Coffee Maker',
    category: ItemCategory.Appliances,
    modelSerialNumber: 'CM-2023-DELUXE',
    date: '2023-07-01',
    dueDate: '2023-07-15',
    status: 'RS',
    group: 'Kitchen',
    oisquote: 300.75, // Overinflated
    ourquote: 250,
    receiptPhotoUrl: 'https://example.com/receipts/coffeemaker.jpg',
  },
  {
    id: 8,
    name: 'Office Chair',
    category: ItemCategory.Furniture,
    modelSerialNumber: 'OC-2023-ERGO',
    date: '2023-07-05',
    dueDate: '2023-07-19',
    status: 'NR',
    group: '',
    oisquote: 400, // Under-inflated
    ourquote: null,
  },
  {
    id: 9,
    name: 'Printer',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'PR-2023-LASER',
    date: '2023-07-10',
    dueDate: '2023-07-24',
    status: 'VPOL',
    group: '',
    oisquote: null, // Missing
    ourquote: 350,
    receiptPhotoUrl: 'https://example.com/receipts/printer.jpg',
  },
  {
    id: 10,
    name: 'Bookshelf',
    category: ItemCategory.Furniture,
    date: '2023-07-15',
    dueDate: '2023-07-29',
    status: 'NR',
    group: 'Bedroom 1',
    oisquote: 180, // Fair
    ourquote: 180,
  },
  {
    id: 11,
    name: 'Microwave',
    category: ItemCategory.Appliances,
    modelSerialNumber: 'MW-2023-SMART',
    date: '2023-07-20',
    dueDate: '2023-08-03',
    status: 'RS',
    group: '',
    oisquote: 250, // Overinflated
    ourquote: 200,
    receiptPhotoUrl: 'https://example.com/receipts/microwave.jpg',
  },
  {
    id: 12,
    name: 'Dining Table',
    category: ItemCategory.Furniture,
    date: '2023-07-25',
    dueDate: '2023-08-08',
    status: 'NR',
    group: '',
    oisquote: 750, // Under-inflated
    ourquote: 800,
  },
  {
    id: 13,
    name: 'Vacuum Cleaner',
    category: ItemCategory.Appliances,
    modelSerialNumber: 'VC-2023-ROBOT',
    date: '2023-08-01',
    dueDate: '2023-08-15',
    status: 'VPOL',
    group: '',
    oisquote: null, // Missing
    ourquote: 400,
    receiptPhotoUrl: 'https://example.com/receipts/vacuum.jpg',
  },
  {
    id: 14,
    name: 'Television',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'TV-2023-4K',
    date: '2023-08-05',
    dueDate: '2023-08-19',
    status: 'RS',
    group: '',
    oisquote: 1200, // Overinflated
    ourquote: 1000,
    receiptPhotoUrl: 'https://example.com/receipts/television.jpg',
  },
  {
    id: 15,
    name: 'Blender',
    category: ItemCategory.Appliances,
    modelSerialNumber: 'BL-2023-PRO',
    date: '2023-08-10',
    dueDate: '2023-08-24',
    status: 'NR',
    group: '',
    oisquote: 120, // Fair
    ourquote: 120,
  },
  {
    id: 16,
    name: 'Curtains',
    category: ItemCategory.Decor,
    date: '2023-08-15',
    dueDate: '2023-08-29',
    status: 'NR',
    group: '',
    oisquote: 150, // Same as ourquote
    ourquote: 150,
  },
];
