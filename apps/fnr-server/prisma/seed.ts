import {
  PrismaClient,
  UserRole,
  EvidenceType,
  ItemStatus,
  ClaimStatus,
  RoomCategory,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { clm003Items } from './seedData/clm003Items';

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
          roomCategory: RoomCategory.OFFICE_STUDY, // Keep - key office item
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
          category: 'Electronics',
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
      items: [
        {
          name: 'Samsung Refrigerator',
          category: 'Appliances',
          roomCategory: RoomCategory.KITCHEN_DINING, // Keep - key kitchen item
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
      items: clm003Items,
    },
    {
      claimNumber: 'CLM004',
      policyNumber: 'POL101',
      description: 'Electronics and appliances claim',
      items: [
        {
          name: 'Television',
          category: 'Electronics',
          roomCategory: RoomCategory.LIVING_ROOM, // Keep - key living room item
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
          category: 'Appliances',
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
  ];

  // Create claims and their items
  const firstInsured = await prisma.insured.findFirst();
  if (!firstInsured) {
    throw new Error('No insured found to create claims for');
  }

  for (const claim of claimData) {
    // Create the claim first with empty arrays
    const createdClaim = await prisma.claim.create({
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
        itemOrder: [],
        localItemIds: [],
      },
    });

    // Create items and collect their IDs
    const itemIds: number[] = [];

    for (const item of claim.items) {
      const createdItem = await prisma.item.create({
        data: {
          claimId: createdClaim.id,
          name: item.name,
          category: item.category,
          roomCategory: item.roomCategory,
          modelSerialNumber: item.modelSerialNumber,
          description: item.description,
          insuredsQuote: item.insuredsQuote,
          ourQuote: item.ourQuote,
          condition: item.condition,
          itemStatus: item.itemStatus,
          ourQuoteProof: item.ourQuoteProof,
        },
      });

      // Create evidence separately if it exists
      if (item.insuredsEvidence && item.insuredsEvidence.length > 0) {
        await Promise.all(
          item.insuredsEvidence.map((evidence) =>
            prisma.evidence.create({
              data: {
                ...evidence,
                itemId: createdItem.id,
              },
            })
          )
        );
      }

      itemIds.push(createdItem.id);
    }

    // Update claim with both itemOrder and localItemIds arrays
    // Both arrays contain the same database IDs initially
    // localItemIds: stores the permanent local IDs (the actual database IDs)
    // itemOrder: controls display order, can be reordered
    await prisma.claim.update({
      where: { id: createdClaim.id },
      data: {
        itemOrder: itemIds,
        localItemIds: itemIds,
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
