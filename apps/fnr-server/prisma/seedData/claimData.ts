import {
  ClaimStatus,
  EvidenceType,
  ItemStatus,
  ItemCategory,
  RoomCategory,
} from '@prisma/client';
import { clm003Items } from './clm003Items';

export const claimData = [
  {
    claimNumber: 'CLM001',
    policyNumber: 'POL123',
    description: 'Water damage from flooding',
    handlerId: null, // Will be set in seed.ts
    items: [
      {
        name: 'MacBook Pro',
        category: ItemCategory.ELECTRONICS,
        roomCategory: RoomCategory.OFFICE_STUDY,
        modelSerialNumber: 'MP2023ABC',
        description: 'Water damaged laptop',
        insuredsQuote: 2499.99,
        ourQuote: 2499.99,
        condition: 'Damaged - water exposure',
        itemStatus: ItemStatus.NR,
        insuredsEvidence: [
          {
            type: EvidenceType.PHOTO,
            filename: 'laptop1.jpg',
            url: '/uploads/laptop1.jpg',
          },
          {
            type: EvidenceType.RECEIPT,
            filename: 'receipt.pdf',
            url: '/uploads/receipt.pdf',
          },
        ],
        ourQuoteProof: null,
      },
      {
        name: 'iPhone 14',
        category: ItemCategory.ELECTRONICS,
        modelSerialNumber: 'IP14XYZ',
        description: 'Water damaged phone',
        insuredsQuote: 999.99,
        ourQuote: null,
        condition: 'Damaged - water exposure',
        itemStatus: ItemStatus.RS,
        insuredsEvidence: [
          {
            type: EvidenceType.PHOTO,
            filename: 'phone1.jpg',
            url: '/uploads/phone1.jpg',
          },
        ],
        ourQuoteProof: null,
      },
    ],
  },
  {
    claimNumber: 'CLM002',
    policyNumber: 'POL456',
    description: 'Fire damage in kitchen',
    handlerId: null, // Will be set in seed.ts
    items: [
      {
        name: 'Samsung Refrigerator',
        category: ItemCategory.APPLIANCES,
        roomCategory: RoomCategory.KITCHEN_DINING,
        modelSerialNumber: 'RF123ABC',
        description: 'Fire damaged fridge',
        insuredsQuote: 3499.99,
        ourQuote: 2000,
        condition: 'Damaged - fire exposure',
        itemStatus: ItemStatus.VPOL,
        insuredsEvidence: [
          {
            type: EvidenceType.PHOTO,
            filename: 'fridge1.jpg',
            url: '/uploads/fridge1.jpg',
          },
        ],
        ourQuoteProof: null,
      },
    ],
  },
  {
    claimNumber: 'CLM003',
    policyNumber: 'POL789',
    description: 'Large household contents claim',
    handlerId: null, // Will be set in seed.ts
    items: clm003Items,
  },
  {
    claimNumber: 'CLM004',
    policyNumber: 'POL101',
    description: 'Electronics and appliances claim',
    handlerId: null, // Will be set in seed.ts
    items: [
      {
        name: 'Television',
        category: ItemCategory.ELECTRONICS,
        roomCategory: RoomCategory.LIVING_ROOM,
        modelSerialNumber: 'TV-2023-4K',
        description: '4K Television',
        insuredsQuote: 2000,
        ourQuote: 1995,
        condition: 'Good',
        itemStatus: ItemStatus.NR,
        insuredsEvidence: [
          {
            type: EvidenceType.RECEIPT,
            filename: 'television.jpg',
            url: 'https://example.com/receipts/television.jpg',
          },
        ],
        ourQuoteProof:
          'https://www.thegoodguys.com.au/lg-55-inches-oled-b4-4k-smart-tv-24-oled55b4psa',
      },
      {
        name: 'Vacuum Cleaner',
        category: ItemCategory.APPLIANCES,
        modelSerialNumber: 'VC-2023-ROBOT',
        description: 'Robot vacuum cleaner',
        insuredsQuote: null,
        ourQuote: null,
        condition: 'Good',
        itemStatus: ItemStatus.RS,
        insuredsEvidence: [
          {
            type: EvidenceType.RECEIPT,
            filename: 'vacuum.jpg',
            url: 'https://example.com/receipts/vacuum.jpg',
          },
        ],
        ourQuoteProof: null,
      },
    ],
  },
  {
    claimNumber: 'CLM005',
    policyNumber: 'POL505',
    description: 'Single item claim',
    items: [
      {
        name: 'Gaming Console',
        category: ItemCategory.ELECTRONICS,
        roomCategory: RoomCategory.LIVING_ROOM,
        modelSerialNumber: 'PS5-2023',
        description: 'PlayStation 5 console',
        insuredsQuote: 750,
        ourQuote: null,
        condition: 'Good',
        itemStatus: ItemStatus.RS,
        insuredsEvidence: [
          {
            type: EvidenceType.PHOTO,
            filename: 'console.jpg',
            url: '/uploads/console.jpg',
          },
        ],
        ourQuoteProof: null,
      },
    ],
  },
  {
    claimNumber: 'CLM006',
    policyNumber: 'POL606',
    description: 'Living room furniture damage',
    handlerId: null, // Will be set in seed.ts for Robert Wilson
    items: [
      {
        name: 'Leather Sofa',
        category: ItemCategory.FURNITURE,
        roomCategory: RoomCategory.LIVING_ROOM,
        modelSerialNumber: 'LS2023-PREMIUM',
        description: 'Water damaged leather sofa',
        insuredsQuote: 2800,
        ourQuote: 2500,
        condition: 'Damaged - water stains',
        itemStatus: ItemStatus.NR,
        insuredsEvidence: [
          {
            type: EvidenceType.PHOTO,
            filename: 'sofa1.jpg',
            url: '/uploads/sofa1.jpg',
          },
          {
            type: EvidenceType.RECEIPT,
            filename: 'sofa_receipt.pdf',
            url: '/uploads/sofa_receipt.pdf',
          },
        ],
        ourQuoteProof: null,
      },
      {
        name: 'Coffee Table',
        category: ItemCategory.FURNITURE,
        roomCategory: RoomCategory.LIVING_ROOM,
        modelSerialNumber: 'CT2023-OAK',
        description: 'Water damaged oak coffee table',
        insuredsQuote: 899.99,
        ourQuote: 850,
        condition: 'Damaged - water marks',
        itemStatus: ItemStatus.NR,
        insuredsEvidence: [
          {
            type: EvidenceType.PHOTO,
            filename: 'table1.jpg',
            url: '/uploads/table1.jpg',
          },
        ],
        ourQuoteProof: null,
      },
    ],
  },
  {
    claimNumber: 'CLM007',
    policyNumber: 'POL707',
    description: 'Kitchen appliances and electronics',
    handlerId: null, // Will be set in seed.ts for Emma Davis
    items: [
      {
        name: 'Coffee Machine',
        category: ItemCategory.APPLIANCES,
        roomCategory: RoomCategory.KITCHEN_DINING,
        modelSerialNumber: 'CM2023-PRO',
        description: 'Professional coffee machine',
        insuredsQuote: 1200,
        ourQuote: 1150,
        condition: 'Damaged - electrical fault',
        itemStatus: ItemStatus.NR,
        insuredsEvidence: [
          {
            type: EvidenceType.PHOTO,
            filename: 'coffee_machine.jpg',
            url: '/uploads/coffee_machine.jpg',
          },
        ],
        ourQuoteProof: null,
      },
      {
        name: 'Food Processor',
        category: ItemCategory.APPLIANCES,
        roomCategory: RoomCategory.KITCHEN_DINING,
        modelSerialNumber: 'FP2023-CHEF',
        description: 'Professional food processor',
        insuredsQuote: 599.99,
        ourQuote: 580,
        condition: 'Damaged - motor failure',
        itemStatus: ItemStatus.NR,
        insuredsEvidence: [
          {
            type: EvidenceType.PHOTO,
            filename: 'processor.jpg',
            url: '/uploads/processor.jpg',
          },
        ],
        ourQuoteProof: null,
      },
      {
        name: 'Kitchen Tablet',
        category: ItemCategory.ELECTRONICS,
        roomCategory: RoomCategory.KITCHEN_DINING,
        modelSerialNumber: 'TB2023-KITCHEN',
        description: 'Kitchen recipe tablet',
        insuredsQuote: 399.99,
        ourQuote: 380,
        condition: 'Damaged - liquid damage',
        itemStatus: ItemStatus.NR,
        insuredsEvidence: [
          {
            type: EvidenceType.PHOTO,
            filename: 'tablet.jpg',
            url: '/uploads/tablet.jpg',
          },
        ],
        ourQuoteProof: null,
      },
    ],
  },
];
