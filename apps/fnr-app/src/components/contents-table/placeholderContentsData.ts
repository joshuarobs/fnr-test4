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
  {
    id: 17,
    name: 'Car Battery',
    category: ItemCategory.Auto,
    modelSerialNumber: 'CB-2023-12V',
    date: '2023-08-20',
    dueDate: '2023-09-03',
    status: 'NR',
    group: 'Garage',
    oisquote: 200,
    ourquote: 180,
  },
  {
    id: 18,
    name: 'Bath towel',
    category: ItemCategory.Bath,
    modelSerialNumber: '',
    date: '2023-08-21',
    dueDate: '2023-09-04',
    status: 'RS',
    group: 'Bathroom',
    oisquote: 150,
    ourquote: 120,
  },
  {
    id: 19,
    name: 'Leather Jacket',
    category: ItemCategory.Clothing,
    date: '2023-08-22',
    dueDate: '2023-09-05',
    status: 'NR',
    group: 'Wardrobe',
    oisquote: 300,
    ourquote: 280,
  },
  {
    id: 20,
    name: 'Insurance Papers',
    category: ItemCategory.Documents,
    date: '2023-08-23',
    dueDate: '2023-09-06',
    status: 'VPOL',
    group: 'Important Documents',
    oisquote: null,
    ourquote: 50,
  },
  {
    id: 21,
    name: 'Lawn Mower',
    category: ItemCategory.Garden,
    modelSerialNumber: 'LM-2023-ELECTRIC',
    date: '2023-08-24',
    dueDate: '2023-09-07',
    status: 'RS',
    group: 'Garden Tools',
    oisquote: 600,
    ourquote: 550,
  },
  {
    id: 22,
    name: 'Lego Toys',
    category: ItemCategory.Kids,
    modelSerialNumber: 'BC-2023-SAFE',
    date: '2023-08-25',
    dueDate: '2023-09-08',
    status: 'NR',
    group: 'Nursery',
    oisquote: 400,
    ourquote: 380,
  },
  {
    id: 23,
    name: 'Miscellaneous Items Box',
    category: ItemCategory.Other,
    date: '2023-08-26',
    dueDate: '2023-09-09',
    status: 'NR',
    group: 'Storage',
    oisquote: 200,
    ourquote: 180,
  },
  {
    id: 24,
    name: 'Dog Bed',
    category: ItemCategory.Pets,
    date: '2023-08-27',
    dueDate: '2023-09-10',
    status: 'RS',
    group: 'Pet Supplies',
    oisquote: 80,
    ourquote: 70,
  },
  {
    id: 25,
    name: 'Tennis Racket',
    category: ItemCategory.Recreation,
    modelSerialNumber: 'TR-2023-PRO',
    date: '2023-08-28',
    dueDate: '2023-09-11',
    status: 'NR',
    group: 'Sports Equipment',
    oisquote: 250,
    ourquote: 220,
  },
  {
    id: 26,
    name: 'Storage Cabinet',
    category: ItemCategory.Storage,
    date: '2023-08-29',
    dueDate: '2023-09-12',
    status: 'RS',
    group: 'Garage',
    oisquote: 350,
    ourquote: 320,
  },
  {
    id: 27,
    name: 'Cleaning Supplies Set',
    category: ItemCategory.Supplies,
    date: '2023-08-30',
    dueDate: '2023-09-13',
    status: 'NR',
    group: 'Laundry Room',
    oisquote: 120,
    ourquote: 100,
  },
  {
    id: 28,
    name: 'Power Drill',
    category: ItemCategory.Tools,
    modelSerialNumber: 'PD-2023-18V',
    date: '2023-08-31',
    dueDate: '2023-09-14',
    status: 'RS',
    group: 'Workshop',
    oisquote: 180,
    ourquote: 160,
  },
];
