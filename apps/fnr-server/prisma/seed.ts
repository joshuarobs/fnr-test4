import { PrismaClient, UserRole, ClaimStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { admin, staffMembers, suppliers, insureds } from './seedData/userData';
import { claimData } from './seedData/claimData';

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
  const createdAdmin = await createUser(admin.user);
  await prisma.staff.create({
    data: {
      baseUserId: createdAdmin.id,
      ...admin.staff,
    },
  });

  // Create Staff Members
  const createdStaffMembers = await Promise.all(
    staffMembers.map(async (staffMember) => {
      const user = await createUser(staffMember.user);
      await prisma.staff.create({
        data: {
          baseUserId: user.id,
          ...staffMember.staff,
        },
      });
      return user;
    })
  );

  // Create Suppliers
  const createdSuppliers = await Promise.all(
    suppliers.map(async (supplier) => {
      const user = await createUser(supplier.user);
      await prisma.supplier.create({
        data: {
          baseUserId: user.id,
          ...supplier.supplier,
        },
      });
      return user;
    })
  );

  // Create Insureds
  const createdInsureds = await Promise.all(
    insureds.map(async (insured) => {
      const user = await createUser(insured.user);
      await prisma.insured.create({
        data: {
          baseUserId: user.id,
          ...insured.insured,
        },
      });
      return user;
    })
  );

  // Get created insured users
  const insuredUsers = await prisma.insured.findMany({
    orderBy: { id: 'asc' },
  });

  // Map claim numbers to handlers and insureds
  const handlerMap = {
    CLM001: createdAdmin.id,
    CLM002: createdStaffMembers[0].id,
    CLM003: createdStaffMembers[1].id,
    CLM004: createdStaffMembers[0].id,
    CLM006: createdStaffMembers[2].id, // Staff member 3 (David Thompson)
    CLM007: createdStaffMembers[3].id, // Staff member 4 (Lisa Anderson)
  };

  const insuredMap = {
    CLM001: insuredUsers[0].id, // John Smith
    CLM002: insuredUsers[3].id, // Jane Brown
    CLM003: insuredUsers[1].id, // John Smith
    CLM004: insuredUsers[2].id, // Jane Brown
    CLM006: insuredUsers[0].id, // Robert Wilson
    CLM007: insuredUsers[2].id, // Emma Davis
  };

  // Create claims and their items
  for (const claim of claimData) {
    const handlerId = handlerMap[claim.claimNumber as keyof typeof handlerMap];
    const insuredId =
      insuredMap[claim.claimNumber as keyof typeof insuredMap] ||
      insuredUsers[0].id; // Default to first insured if not mapped

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
        insuredId: insuredId,
        handlerId: handlerId,
        creatorId: createdStaffMembers[0].id,
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

  // Add some comments (except for CLM005 which is unassigned)
  const claims = await prisma.claim.findMany({
    where: {
      claimNumber: { not: 'CLM005' },
    },
  });

  for (const claim of claims) {
    await Promise.all([
      prisma.comment.create({
        data: {
          claimId: claim.id,
          userId: createdStaffMembers[0].id,
          content: 'Initial assessment completed',
          isInternal: true,
        },
      }),
      prisma.comment.create({
        data: {
          claimId: claim.id,
          userId: createdStaffMembers[0].id,
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
