import {
  PrismaClient,
  UserRole,
  EvidenceType,
  ItemStatus,
  ClaimStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function cleanDatabase() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log('Error clearing database:', error);
  }
}

async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  middleName?: string;
}) {
  return prisma.baseUser.create({
    data: {
      ...data,
      password: await bcrypt.hash(data.password, 10),
    },
  });
}

async function main() {
  console.log('Starting database seed...');

  await cleanDatabase();

  // Create Admin
  const admin = await createUser({
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
  });

  await prisma.staff.create({
    data: {
      baseUserId: admin.id,
      department: 'Administration',
      employeeId: 'ADM001',
      position: 'System Administrator',
      permissions: ['ALL'],
    },
  });

  // Create Staff Members
  const staffMembers = await Promise.all([
    createUser({
      email: 'claims@example.com',
      password: 'staff123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'STAFF',
    }),
    createUser({
      email: 'valuations@example.com',
      password: 'staff123',
      firstName: 'Mike',
      lastName: 'Williams',
      role: 'STAFF',
    }),
  ]);

  await Promise.all(
    staffMembers.map((staff, index) =>
      prisma.staff.create({
        data: {
          baseUserId: staff.id,
          department: 'Claims',
          employeeId: `STF00${index + 1}`,
          position: 'Claims Handler',
          permissions: ['CREATE_CLAIM', 'UPDATE_CLAIM', 'VIEW_CLAIM'],
        },
      })
    )
  );

  // Create Suppliers
  const suppliers = await Promise.all([
    createUser({
      email: 'electronics@supplier.com',
      password: 'supplier123',
      firstName: 'Tech',
      lastName: 'Solutions',
      role: 'SUPPLIER',
    }),
    createUser({
      email: 'appliances@supplier.com',
      password: 'supplier123',
      firstName: 'Home',
      lastName: 'Appliances',
      role: 'SUPPLIER',
    }),
  ]);

  await Promise.all(
    suppliers.map((supplier, index) =>
      prisma.supplier.create({
        data: {
          baseUserId: supplier.id,
          company: index === 0 ? 'Tech Solutions Ltd' : 'Home Appliances Co',
          serviceType:
            index === 0
              ? ['Electronics', 'Computers', 'Phones']
              : ['Appliances', 'White Goods', 'Kitchen'],
          areas: ['North', 'South', 'East', 'West'],
          ratings: 4.5,
        },
      })
    )
  );

  // Create Insureds
  const insureds = await Promise.all([
    createUser({
      email: 'john@example.com',
      password: 'insured123',
      firstName: 'John',
      lastName: 'Smith',
      role: 'INSURED',
    }),
    createUser({
      email: 'jane@example.com',
      password: 'insured123',
      firstName: 'Jane',
      lastName: 'Brown',
      role: 'INSURED',
    }),
  ]);

  await Promise.all(
    insureds.map((insured, index) =>
      prisma.insured.create({
        data: {
          baseUserId: insured.id,
          address: `${index + 1}23 Main Street, City`,
        },
      })
    )
  );

  // Create Claims with Items
  const claimData = [
    {
      claimNumber: 'CLM001',
      policyNumber: 'POL123',
      description: 'Water damage from flooding',
      items: [
        {
          name: 'MacBook Pro',
          category: 'Electronics',
          modelSerialNumber: 'MP2023ABC',
          description: 'Water damaged laptop',
          insuredsQuote: 2499.99,
          condition: 'Damaged - water exposure',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [
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
        },
        {
          name: 'iPhone 14',
          category: 'Electronics',
          modelSerialNumber: 'IP14XYZ',
          description: 'Water damaged phone',
          insuredsQuote: 999.99,
          condition: 'Damaged - water exposure',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [
            {
              type: EvidenceType.PHOTO,
              filename: 'phone1.jpg',
              url: '/uploads/phone1.jpg',
            },
          ],
        },
      ],
    },
    {
      claimNumber: 'CLM002',
      policyNumber: 'POL456',
      description: 'Fire damage in kitchen',
      items: [
        {
          name: 'Samsung Refrigerator',
          category: 'Appliances',
          modelSerialNumber: 'RF123ABC',
          description: 'Fire damaged fridge',
          insuredsQuote: 3499.99,
          condition: 'Damaged - fire exposure',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [
            {
              type: EvidenceType.PHOTO,
              filename: 'fridge1.jpg',
              url: '/uploads/fridge1.jpg',
            },
          ],
        },
      ],
    },
    // Updated CLM003 with all items from placeholderContentsData
    {
      claimNumber: 'CLM003',
      policyNumber: 'POL789',
      description: 'Large household contents claim',
      items: [
        {
          name: 'Laptop',
          category: 'Electronics',
          modelSerialNumber: 'LT-2023-XPS15',
          description: 'Home office laptop',
          insuredsQuote: 2000,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [
            {
              type: EvidenceType.RECEIPT,
              filename: 'laptop.jpg',
              url: 'https://example.com/receipts/laptop.jpg',
            },
          ],
        },
        {
          name: 'Office Desk',
          category: 'Furniture',
          modelSerialNumber: null,
          description: 'Home office desk',
          insuredsQuote: 2000,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Antivirus License',
          category: 'Digital',
          modelSerialNumber: 'AV-2023-PRO',
          description: 'Digital software license',
          insuredsQuote: null,
          condition: 'Good',
          status: ItemStatus.PENDING,
          evidence: [
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
          modelSerialNumber: 'SM-G-S23-ULTRA',
          description: 'Mobile phone',
          insuredsQuote: 1600,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [
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
          modelSerialNumber: null,
          description: 'Food items',
          insuredsQuote: 155,
          condition: 'N/A',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Area Rug',
          category: 'Decor',
          modelSerialNumber: null,
          description: 'Loungeroom rug',
          insuredsQuote: 500,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Coffee Maker',
          category: 'Appliances',
          modelSerialNumber: 'CM-2023-DELUXE',
          description: 'Kitchen appliance',
          insuredsQuote: 300.75,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [
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
          modelSerialNumber: 'OC-2023-ERGO',
          description: 'Ergonomic office chair',
          insuredsQuote: 400,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Printer',
          category: 'Electronics',
          modelSerialNumber: 'PR-2023-LASER',
          description: 'Laser printer',
          insuredsQuote: null,
          condition: 'Good',
          status: ItemStatus.PENDING,
          evidence: [
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
          modelSerialNumber: null,
          description: 'Bedroom bookshelf',
          insuredsQuote: 180,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Microwave',
          category: 'Appliances',
          modelSerialNumber: 'MW-2023-SMART',
          description: 'Kitchen microwave',
          insuredsQuote: 250,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [
            {
              type: EvidenceType.RECEIPT,
              filename: 'microwave.jpg',
              url: 'https://example.com/receipts/microwave.jpg',
            },
          ],
        },
        {
          name: 'Dining Table',
          category: 'Furniture',
          modelSerialNumber: null,
          description: 'Dining room furniture',
          insuredsQuote: 750,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Vacuum Cleaner',
          category: 'Appliances',
          modelSerialNumber: 'VC-2023-ROBOT',
          description: 'Robot vacuum',
          insuredsQuote: null,
          condition: 'Good',
          status: ItemStatus.PENDING,
          evidence: [
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
          modelSerialNumber: 'TV-2023-4K',
          description: '4K TV',
          insuredsQuote: 1200,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [
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
          modelSerialNumber: 'BL-2023-PRO',
          description: 'Kitchen blender',
          insuredsQuote: 120,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Curtains',
          category: 'Decor',
          modelSerialNumber: null,
          description: 'Window curtains',
          insuredsQuote: 150,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Car Battery',
          category: 'Auto',
          modelSerialNumber: 'CB-2023-12V',
          description: 'Garage car battery',
          insuredsQuote: 200,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Bath towel',
          category: 'Bath',
          modelSerialNumber: '',
          description: 'Bathroom towel',
          insuredsQuote: 150,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Leather Jacket',
          category: 'Clothing',
          modelSerialNumber: null,
          description: 'Wardrobe leather jacket',
          insuredsQuote: 300,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Insurance Papers',
          category: 'Documents',
          modelSerialNumber: null,
          description: 'Important documents',
          insuredsQuote: null,
          condition: 'Good',
          status: ItemStatus.PENDING,
          evidence: [],
        },
        {
          name: 'Lawn Mower',
          category: 'Garden',
          modelSerialNumber: 'LM-2023-ELECTRIC',
          description: 'Electric lawn mower',
          insuredsQuote: 600,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Lego Toys',
          category: 'Kids',
          modelSerialNumber: 'BC-2023-SAFE',
          description: 'Children toys',
          insuredsQuote: 400,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Miscellaneous Items Box',
          category: 'Other',
          modelSerialNumber: null,
          description: 'Storage box with misc items',
          insuredsQuote: 200,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Dog Bed',
          category: 'Pets',
          modelSerialNumber: null,
          description: 'Pet supplies',
          insuredsQuote: 80,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Tennis Racket',
          category: 'Recreation',
          modelSerialNumber: 'TR-2023-PRO',
          description: 'Sports equipment',
          insuredsQuote: 250,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Storage Cabinet',
          category: 'Storage',
          modelSerialNumber: null,
          description: 'Garage storage',
          insuredsQuote: 350,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Cleaning Supplies Set',
          category: 'Supplies',
          modelSerialNumber: null,
          description: 'Laundry room supplies',
          insuredsQuote: 120,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
        {
          name: 'Power Drill',
          category: 'Tools',
          modelSerialNumber: 'PD-2023-18V',
          description: 'Workshop power tool',
          insuredsQuote: 180,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [],
        },
      ],
    },
    {
      claimNumber: 'CLM004',
      policyNumber: 'POL101',
      description: 'Electronics and appliances claim',
      items: [
        {
          name: 'Television',
          category: 'Electronics',
          modelSerialNumber: 'TV-2023-4K',
          description: '4K Television',
          insuredsQuote: 1200,
          condition: 'Good',
          status: ItemStatus.AWAITING_QUOTES,
          evidence: [
            {
              type: EvidenceType.RECEIPT,
              filename: 'television.jpg',
              url: 'https://example.com/receipts/television.jpg',
            },
          ],
        },
        {
          name: 'Vacuum Cleaner',
          category: 'Appliances',
          modelSerialNumber: 'VC-2023-ROBOT',
          description: 'Robot vacuum cleaner',
          insuredsQuote: null,
          condition: 'Good',
          status: ItemStatus.PENDING,
          evidence: [
            {
              type: EvidenceType.RECEIPT,
              filename: 'vacuum.jpg',
              url: 'https://example.com/receipts/vacuum.jpg',
            },
          ],
        },
      ],
    },
  ];

  // Create claims and their items
  const firstInsured = await prisma.insured.findFirst();
  if (!firstInsured) {
    throw new Error('No insured found to create claims for');
  }

  for (const claim of claimData) {
    await prisma.claim.create({
      data: {
        claimNumber: claim.claimNumber,
        policyNumber: claim.policyNumber,
        description: claim.description,
        status: ClaimStatus.UNDER_REVIEW,
        incidentDate: new Date(),
        totalClaimed: claim.items.reduce(
          (sum, item) => sum + (item.insuredsQuote || 0),
          0
        ),
        insuredId: firstInsured.id,
        handlerId: staffMembers[0].id,
        creatorId: staffMembers[0].id,
        items: {
          create: claim.items.map((item) => ({
            name: item.name,
            category: item.category,
            modelSerialNumber: item.modelSerialNumber,
            description: item.description,
            insuredsQuote: item.insuredsQuote,
            condition: item.condition,
            status: item.status,
            evidence: {
              create: item.evidence,
            },
          })),
        },
      },
    });
  }

  // Add some comments
  const claims = await prisma.claim.findMany();

  for (const claim of claims) {
    await Promise.all([
      prisma.comment.create({
        data: {
          claimId: claim.id,
          userId: staffMembers[0].id,
          content: 'Initial assessment completed',
          isInternal: true,
        },
      }),
      prisma.comment.create({
        data: {
          claimId: claim.id,
          userId: staffMembers[0].id,
          content: 'Awaiting additional documentation',
          isInternal: false,
        },
      }),
    ]);
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error while seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
