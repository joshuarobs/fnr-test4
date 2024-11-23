import { ItemStatus, EvidenceType, RoomCategory } from '@prisma/client';

export const clm003Items = [
  {
    name: 'Laptop',
    category: 'Electronics',
    roomcategory: RoomCategory.OFFICE_STUDY,
    modelSerialNumber: 'LT-2023-XPS15',
    description: 'Home office laptop',
    insuredsQuote: 2000,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [
      {
        type: EvidenceType.RECEIPT,
        filename: 'laptop.jpg',
        url: 'https://example.com/receipts/laptop.jpg',
      },
    ],
    ourQuoteProof:
      'https://www.apple.com/au/shop/buy-mac/macbook-pro/14-inch-space-black-standard-display-apple-m4-chip-with-10-core-cpu-and-10-core-gpu-16gb-memory-512gb',
  },
  {
    name: 'Office Desk',
    category: 'Furniture',
    roomcategory: RoomCategory.OFFICE_STUDY,
    modelSerialNumber: null,
    description: 'Home office desk',
    insuredsQuote: 500,
    ourQuote: 450,
    condition: 'Good',
    itemStatus: ItemStatus.RS,
    insuredsEvidence: [],
  },
  {
    name: 'Antivirus License',
    category: 'Digital',
    roomcategory: RoomCategory.OFFICE_STUDY,
    modelSerialNumber: 'AV-2023-PRO',
    description: 'Digital software license',
    insuredsQuote: null,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [
      {
        type: EvidenceType.RECEIPT,
        filename: 'antivirus.jpg',
        url: 'https://example.com/receipts/antivirus.jpg',
      },
    ],
  },
  {
    name: 'Smartphone',
    category: 'Electronics',
    roomcategory: RoomCategory.OTHER,
    modelSerialNumber: 'SM-G-S23-ULTRA',
    description: 'Mobile phone',
    insuredsQuote: 1600,
    ourQuote: 1600,
    condition: 'Good',
    itemStatus: ItemStatus.VPOL,
    insuredsEvidence: [
      {
        type: EvidenceType.RECEIPT,
        filename: 'smartphone.jpg',
        url: 'https://example.com/receipts/smartphone.jpg',
      },
    ],
  },
  {
    name: 'Groceries',
    category: 'Food',
    roomcategory: RoomCategory.KITCHEN_DINING,
    modelSerialNumber: null,
    description: 'Food items',
    insuredsQuote: 155,
    ourQuote: null,
    condition: 'N/A',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Area Rug',
    category: 'Decor',
    roomcategory: RoomCategory.LIVING_ROOM,
    modelSerialNumber: null,
    description: 'Loungeroom rug',
    insuredsQuote: 500,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.RS,
    insuredsEvidence: [],
  },
  {
    name: 'Coffee Maker',
    category: 'Appliances',
    roomcategory: RoomCategory.KITCHEN_DINING,
    modelSerialNumber: 'CM-2023-DELUXE',
    description: 'Kitchen appliance',
    insuredsQuote: 300.75,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [
      {
        type: EvidenceType.RECEIPT,
        filename: 'coffeemaker.jpg',
        url: 'https://example.com/receipts/coffeemaker.jpg',
      },
    ],
  },
  {
    name: 'Office Chair',
    category: 'Furniture',
    roomcategory: RoomCategory.OFFICE_STUDY,
    modelSerialNumber: 'OC-2023-ERGO',
    description: 'Ergonomic office chair',
    insuredsQuote: 400,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.VPOL,
    insuredsEvidence: [],
  },
  {
    name: 'Printer',
    category: 'Electronics',
    roomcategory: RoomCategory.OFFICE_STUDY,
    modelSerialNumber: 'PR-2023-LASER',
    description: 'Laser printer',
    insuredsQuote: null,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [
      {
        type: EvidenceType.RECEIPT,
        filename: 'printer.jpg',
        url: 'https://example.com/receipts/printer.jpg',
      },
    ],
  },
  {
    name: 'Bookshelf',
    category: 'Furniture',
    roomcategory: RoomCategory.BEDROOM_1,
    modelSerialNumber: null,
    description: 'Bedroom bookshelf',
    insuredsQuote: 180,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Microwave',
    category: 'Appliances',
    roomcategory: RoomCategory.KITCHEN_DINING,
    modelSerialNumber: 'MW-2023-SMART',
    description: 'Kitchen microwave',
    insuredsQuote: 250,
    ourQuote: 250,
    condition: 'Good',
    itemStatus: ItemStatus.RS,
    insuredsEvidence: [
      {
        type: EvidenceType.RECEIPT,
        filename: 'microwave.jpg',
        url: 'https://example.com/receipts/microwave.jpg',
      },
    ],
    ourQuoteProof:
      'https://www.thegoodguys.com.au/panasonic-32l-1100w-inverter-microwave-white-nn-st64jwqpq',
  },
  {
    name: 'Dining Table',
    category: 'Furniture',
    roomcategory: RoomCategory.KITCHEN_DINING,
    modelSerialNumber: null,
    description: 'Dining room furniture',
    insuredsQuote: 750,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Vacuum Cleaner',
    category: 'Appliances',
    roomcategory: RoomCategory.STORAGE,
    modelSerialNumber: 'VC-2023-ROBOT',
    description: 'Robot vacuum',
    insuredsQuote: null,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.VPOL,
    insuredsEvidence: [
      {
        type: EvidenceType.RECEIPT,
        filename: 'vacuum.jpg',
        url: 'https://example.com/receipts/vacuum.jpg',
      },
    ],
  },
  {
    name: 'Television',
    category: 'Electronics',
    roomcategory: RoomCategory.LIVING_ROOM,
    modelSerialNumber: 'TV-2023-4K',
    description: '4K TV',
    insuredsQuote: 1200,
    ourQuote: 900,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [
      {
        type: EvidenceType.RECEIPT,
        filename: 'television.jpg',
        url: 'https://example.com/receipts/television.jpg',
      },
    ],
  },
  {
    name: 'Blender',
    category: 'Appliances',
    roomcategory: RoomCategory.KITCHEN_DINING,
    modelSerialNumber: 'BL-2023-PRO',
    description: 'Kitchen blender',
    insuredsQuote: 120,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Curtains',
    category: 'Decor',
    roomcategory: RoomCategory.LIVING_ROOM,
    modelSerialNumber: null,
    description: 'Window curtains',
    insuredsQuote: 150,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.VPOL,
    insuredsEvidence: [],
  },
  {
    name: 'Car Battery',
    category: 'Auto',
    roomcategory: RoomCategory.GARAGE,
    modelSerialNumber: 'CB-2023-12V',
    description: 'Garage car battery',
    insuredsQuote: 200,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Bath towel',
    category: 'Bath',
    roomcategory: RoomCategory.BATHROOM,
    modelSerialNumber: '',
    description: 'Bathroom towel',
    insuredsQuote: 150,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Leather Jacket',
    category: 'Clothing',
    roomcategory: RoomCategory.BEDROOM_1,
    modelSerialNumber: null,
    description: 'Wardrobe leather jacket',
    insuredsQuote: 300,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.RS,
    insuredsEvidence: [],
  },
  {
    name: 'Insurance Papers',
    category: 'Documents',
    roomcategory: RoomCategory.OFFICE_STUDY,
    modelSerialNumber: null,
    description: 'Important documents',
    insuredsQuote: null,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Lawn Mower',
    category: 'Garden',
    roomcategory: RoomCategory.GARDEN,
    modelSerialNumber: 'LM-2023-ELECTRIC',
    description: 'Electric lawn mower',
    insuredsQuote: 600,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.VPOL,
    insuredsEvidence: [],
  },
  {
    name: 'Lego Toys',
    category: 'Kids',
    roomcategory: RoomCategory.BEDROOM_2,
    modelSerialNumber: 'BC-2023-SAFE',
    description: 'Children toys',
    insuredsQuote: 400,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Miscellaneous Items Box',
    category: 'Other',
    roomcategory: RoomCategory.STORAGE,
    modelSerialNumber: null,
    description: 'Storage box with misc items',
    insuredsQuote: 200,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Dog Bed',
    category: 'Pets',
    roomcategory: RoomCategory.LAUNDRY,
    modelSerialNumber: null,
    description: 'Pet supplies',
    insuredsQuote: 80,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.RS,
    insuredsEvidence: [],
  },
  {
    name: 'Tennis Racket',
    category: 'Recreation',
    roomcategory: RoomCategory.GARAGE,
    modelSerialNumber: 'TR-2023-PRO',
    description: 'Sports equipment',
    insuredsQuote: 250,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.VPOL,
    insuredsEvidence: [],
  },
  {
    name: 'Storage Cabinet',
    category: 'Storage',
    roomcategory: RoomCategory.GARAGE,
    modelSerialNumber: null,
    description: 'Garage storage',
    insuredsQuote: 350,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Cleaning Supplies Set',
    category: 'Supplies',
    roomcategory: RoomCategory.LAUNDRY,
    modelSerialNumber: null,
    description: 'Laundry room supplies',
    insuredsQuote: 120,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
  {
    name: 'Power Drill',
    category: 'Tools',
    roomcategory: RoomCategory.GARAGE,
    modelSerialNumber: 'PD-2023-18V',
    description: 'Workshop power tool',
    insuredsQuote: 180,
    ourQuote: null,
    condition: 'Good',
    itemStatus: ItemStatus.NR,
    insuredsEvidence: [],
  },
];
