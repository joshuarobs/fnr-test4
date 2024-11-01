import { Item } from './item';
import { ItemCategory } from './itemCategories';

export const randomItemsData: Item[] = [
  {
    id: 1,
    name: 'Laptop',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'LT-2022-XPS15',
    date: '2022-07-15',
    dueDate: '2022-07-29',
    amount: 1799.99,
    status: 'RS',
    group: '',
    oisquote: 2000,
    ourquote: 1800,
    receiptPhotoUrl: 'https://example.com/receipts/laptop2022.jpg',
  },
  {
    id: 2,
    name: 'Office Chair',
    category: ItemCategory.Furniture,
    modelSerialNumber: 'OC-2021-ERGOX',
    date: '2021-03-10',
    dueDate: '2021-03-24',
    amount: 399.99,
    status: 'NR',
    group: '',
    oisquote: 450,
    ourquote: 400,
  },
  {
    id: 3,
    name: 'Smartphone',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'SP-2023-GALX',
    date: '2023-01-05',
    dueDate: '2023-01-19',
    amount: 999.99,
    status: 'RS',
    group: '',
    oisquote: 1100,
    ourquote: 1000,
    receiptPhotoUrl: 'https://example.com/receipts/smartphone2023.jpg',
  },
  {
    id: 4,
    name: 'Desk',
    category: ItemCategory.Furniture,
    modelSerialNumber: 'DK-2020-STAND',
    date: '2020-11-20',
    dueDate: '2020-12-04',
    amount: 599.99,
    status: 'NR',
    group: '',
    oisquote: 600,
    ourquote: 600,
  },
  {
    id: 5,
    name: 'Monitor',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'MN-2022-4KHD',
    date: '2022-09-01',
    dueDate: '2022-09-15',
    amount: 349.99,
    status: 'RS',
    group: '',
    oisquote: 400,
    ourquote: 350,
    receiptPhotoUrl: 'https://example.com/receipts/monitor2022.jpg',
  },
  {
    id: 6,
    name: 'Printer',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'PR-2021-LSRJ',
    date: '2021-06-15',
    dueDate: '2021-06-29',
    amount: 299.99,
    status: 'VPOL',
    group: '',
    oisquote: 350,
    ourquote: 300,
  },
  {
    id: 7,
    name: 'Filing Cabinet',
    category: ItemCategory.Furniture,
    modelSerialNumber: 'FC-2019-METAL4',
    date: '2019-04-22',
    dueDate: '2019-05-06',
    amount: 199.99,
    status: 'NR',
    group: '',
    oisquote: 220,
    ourquote: 200,
  },
  {
    id: 8,
    name: 'Software License',
    category: ItemCategory.Other,
    modelSerialNumber: 'SL-2023-OFFIC',
    date: '2023-02-28',
    dueDate: '2023-03-14',
    amount: 149.99,
    status: 'RS',
    group: '',
    oisquote: 160,
    ourquote: 150,
    receiptPhotoUrl: 'https://example.com/receipts/software2023.jpg',
  },
  {
    id: 9,
    name: 'Projector',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'PJ-2020-4KHD',
    date: '2020-08-10',
    dueDate: '2020-08-24',
    amount: 799.99,
    status: 'NR',
    group: '',
    oisquote: 850,
    ourquote: 800,
  },
  {
    id: 10,
    name: 'Whiteboard',
    category: ItemCategory.Supplies,
    modelSerialNumber: 'WB-2022-MAGN',
    date: '2022-11-05',
    dueDate: '2022-11-19',
    amount: 89.99,
    status: 'RS',
    group: '',
    oisquote: 100,
    ourquote: 90,
    receiptPhotoUrl: 'https://example.com/receipts/whiteboard2022.jpg',
  },
  {
    id: 11,
    name: 'Coffee Machine',
    category: ItemCategory.Appliances,
    modelSerialNumber: 'CM-2021-ESPRS',
    date: '2021-12-01',
    dueDate: '2021-12-15',
    amount: 249.99,
    status: 'NR',
    group: '',
    oisquote: 275,
    ourquote: 250,
  },
  {
    id: 12,
    name: 'External Hard Drive',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'HD-2023-5TB',
    date: '2023-03-20',
    dueDate: '2023-04-03',
    amount: 129.99,
    status: 'RS',
    group: '',
    oisquote: 140,
    ourquote: 130,
    receiptPhotoUrl: 'https://example.com/receipts/harddrive2023.jpg',
  },
  {
    id: 13,
    name: 'Office Sofa',
    category: ItemCategory.Furniture,
    modelSerialNumber: 'SF-2020-LTHR',
    date: '2020-02-15',
    dueDate: '2020-02-29',
    amount: 899.99,
    status: 'NR',
    group: '',
    oisquote: 950,
    ourquote: 900,
  },
  {
    id: 14,
    name: 'Wireless Mouse',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'WM-2022-BLTH',
    date: '2022-06-10',
    dueDate: '2022-06-24',
    amount: 49.99,
    status: 'RS',
    group: '',
    oisquote: 55,
    ourquote: 50,
    receiptPhotoUrl: 'https://example.com/receipts/mouse2022.jpg',
  },
  {
    id: 15,
    name: 'Antivirus Software',
    category: ItemCategory.Other,
    modelSerialNumber: 'AV-2021-PROT',
    date: '2021-09-05',
    dueDate: '2021-09-19',
    amount: 79.99,
    status: 'VPOL',
    group: '',
    oisquote: 90,
    ourquote: 80,
  },
  {
    id: 16,
    name: 'Conference Table',
    category: ItemCategory.Furniture,
    modelSerialNumber: 'CT-2019-OVAL',
    date: '2019-11-20',
    dueDate: '2019-12-04',
    amount: 1299.99,
    status: 'NR',
    group: '',
    oisquote: 1400,
    ourquote: 1300,
  },
  {
    id: 17,
    name: 'Tablet',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'TB-2023-PRO',
    date: '2023-04-15',
    dueDate: '2023-04-29',
    amount: 699.99,
    status: 'RS',
    group: '',
    oisquote: 750,
    ourquote: 700,
    receiptPhotoUrl: 'https://example.com/receipts/tablet2023.jpg',
  },
  {
    id: 18,
    name: 'Paper Shredder',
    category: ItemCategory.Supplies,
    modelSerialNumber: 'PS-2020-CROS',
    date: '2020-07-01',
    dueDate: '2020-07-15',
    amount: 89.99,
    status: 'NR',
    group: '',
    oisquote: 100,
    ourquote: 90,
  },
  {
    id: 19,
    name: 'VPN Service',
    category: ItemCategory.Other,
    modelSerialNumber: 'VPN-2022-SECR',
    date: '2022-01-10',
    dueDate: '2022-01-24',
    amount: 59.99,
    status: 'RS',
    group: '',
    oisquote: 65,
    ourquote: 60,
    receiptPhotoUrl: 'https://example.com/receipts/vpn2022.jpg',
  },
  {
    id: 20,
    name: 'Ergonomic Keyboard',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'KB-2021-ERGO',
    date: '2021-05-20',
    dueDate: '2021-06-03',
    amount: 129.99,
    status: 'NR',
    group: '',
    oisquote: 140,
    ourquote: 130,
  },
  {
    id: 21,
    name: 'Desk Lamp',
    category: ItemCategory.Supplies,
    modelSerialNumber: 'DL-2023-LED',
    date: '2023-02-05',
    dueDate: '2023-02-19',
    amount: 39.99,
    status: 'RS',
    group: '',
    oisquote: 45,
    ourquote: 40,
    receiptPhotoUrl: 'https://example.com/receipts/lamp2023.jpg',
  },
  {
    id: 22,
    name: 'Microwave',
    category: ItemCategory.Appliances,
    modelSerialNumber: 'MW-2020-1000W',
    date: '2020-10-15',
    dueDate: '2020-10-29',
    amount: 99.99,
    status: 'NR',
    group: '',
    oisquote: 110,
    ourquote: 100,
  },
  {
    id: 23,
    name: 'Cloud Storage',
    category: ItemCategory.Other,
    modelSerialNumber: 'CS-2022-1TB',
    date: '2022-08-01',
    dueDate: '2022-08-15',
    amount: 99.99,
    status: 'VPOL',
    group: '',
    oisquote: 110,
    ourquote: 100,
  },
  {
    id: 24,
    name: 'Office Plants',
    category: ItemCategory.Supplies,
    date: '2021-04-10',
    dueDate: '2021-04-24',
    amount: 149.99,
    status: 'NR',
    group: '',
    oisquote: 160,
    ourquote: 150,
  },
  {
    id: 25,
    name: 'Wireless Headphones',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'WH-2023-NOISE',
    date: '2023-05-05',
    dueDate: '2023-05-19',
    amount: 199.99,
    status: 'RS',
    group: '',
    oisquote: 220,
    ourquote: 200,
    receiptPhotoUrl: 'https://example.com/receipts/headphones2023.jpg',
  },
  {
    id: 26,
    name: 'Air Purifier',
    category: ItemCategory.Appliances,
    modelSerialNumber: 'AP-2022-HEPA',
    date: '2022-03-15',
    dueDate: '2022-03-29',
    amount: 179.99,
    status: 'NR',
    group: '',
    oisquote: 200,
    ourquote: 180,
  },
  {
    id: 27,
    name: 'Presentation Clicker',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'PC-2021-LASER',
    date: '2021-11-01',
    dueDate: '2021-11-15',
    amount: 29.99,
    status: 'RS',
    group: '',
    oisquote: 35,
    ourquote: 30,
    receiptPhotoUrl: 'https://example.com/receipts/clicker2021.jpg',
  },
  {
    id: 28,
    name: 'Standing Desk Converter',
    category: ItemCategory.Furniture,
    modelSerialNumber: 'SDC-2020-ADJ',
    date: '2020-06-20',
    dueDate: '2020-07-04',
    amount: 249.99,
    status: 'NR',
    group: '',
    oisquote: 275,
    ourquote: 250,
  },
  {
    id: 29,
    name: 'Webcam',
    category: ItemCategory.Electronics,
    modelSerialNumber: 'WC-2022-1080P',
    date: '2022-12-10',
    dueDate: '2022-12-24',
    amount: 79.99,
    status: 'RS',
    group: '',
    oisquote: 90,
    ourquote: 80,
    receiptPhotoUrl: 'https://example.com/receipts/webcam2022.jpg',
  },
  {
    id: 30,
    name: 'Water Dispenser',
    category: ItemCategory.Appliances,
    modelSerialNumber: 'WD-2019-COOL',
    date: '2019-08-05',
    dueDate: '2019-08-19',
    amount: 159.99,
    status: 'NR',
    group: '',
    oisquote: 175,
    ourquote: 160,
  },
];
