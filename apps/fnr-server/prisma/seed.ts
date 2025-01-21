import { PrismaClient, UserRole, ClaimStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { admin, staffMembers, suppliers, insureds } from './seedData/userData';
import { claimData } from './seedData/claimData';
import { recalculateClaimValues } from '../src/lib/claimHelpers';
import { seedContributors } from './seedData/seedContributors';

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

  // Get created insured users with their BaseUser IDs
  const insuredUsers = await prisma.insured.findMany({
    orderBy: { id: 'asc' },
    include: {
      baseUser: true,
    },
  });

  // Map claim numbers to handlers and insureds
  const handlerMap = {
    CLM001: createdAdmin.id,
    CLM002: createdAdmin.id,
    CLM003: createdStaffMembers[1].id, // Mike Williams
    CLM004: createdAdmin.id,
    CLM005: createdStaffMembers[0].id,
    CLM006: createdStaffMembers[1].id,
    CLM007: createdStaffMembers[0].id,
    CLM009: createdStaffMembers[2].id, // Staff member 3 (David Thompson)
    CLM010: createdStaffMembers[3].id, // Staff member 4 (Lisa Anderson)
    CLM011: createdAdmin.id,
  };

  // Create a map of BaseUser IDs to Insured IDs
  const baseUserToInsuredMap = new Map(
    insuredUsers.map((insured) => [insured.baseUser.id, insured.id])
  );

  const insuredMap = {
    CLM001: insuredUsers[0].id, // John Smith
    CLM002: insuredUsers[1].id, // Another insured
    CLM003: insuredUsers[2].id, // Another insured
    CLM004: insuredUsers[3].id, // Another insured
    CLM005: insuredUsers[3].id, // Jane Brown
    CLM006: insuredUsers[1].id, // John Smith
    CLM007: insuredUsers[2].id, // Jane Brown
    CLM009: insuredUsers[0].id, // Robert Wilson
    CLM010: insuredUsers[2].id, // Emma Davis
    CLM011: baseUserToInsuredMap.get(createdAdmin.id) || insuredUsers[0].id, // Admin or default to first insured
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
        itemOrder: [],
        localItemIds: [],
        insured: {
          connect: {
            id: insuredId,
          },
        },
        ...(handlerId
          ? {
              handler: {
                connect: {
                  id: handlerId,
                },
              },
            }
          : {}),
        creator: {
          connect: {
            id: handlerId || insuredUsers[0].baseUser.id,
          },
        },
        // Set CLM003 as archived by default
        ...(claim.claimNumber === 'CLM003'
          ? {
              isDeleted: true,
              deletedAt: new Date(),
              deletedUser: {
                connect: {
                  id: handlerId,
                },
              },
              deleteReason: 'Archived during initial setup',
            }
          : {}),
      },
    });

    // Add activity log for claim creation (only if there's a handler)
    if (handlerId) {
      await prisma.activityLog.create({
        data: {
          activityType: 'CLAIM_CREATED',
          userId: handlerId,
          claimId: createdClaim.id,
          metadata: {
            claimNumber: claim.claimNumber,
            description: claim.description,
          },
        },
      });
    }

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

    // Add contributors
    await seedContributors(
      prisma,
      createdClaim,
      handlerId,
      createdAdmin,
      createdStaffMembers
    );
  }

  // Add some comments (except for CLM005 which is unassigned)
  const claims = await prisma.claim.findMany({
    where: {
      claimNumber: { not: 'CLM008' },
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

  // Add supplier allocations
  console.log('Adding supplier allocations...');

  // Get all suppliers
  const allSuppliers = await prisma.supplier.findMany();

  // Get all claims
  const allClaims = await prisma.claim.findMany();

  for (const claim of allClaims) {
    let suppliersToAllocate: typeof allSuppliers = [];

    switch (claim.claimNumber) {
      case 'CLM010': // 2 suppliers
        suppliersToAllocate = allSuppliers.slice(0, 2); // First 2 suppliers
        break;
      case 'CLM007': // 2 suppliers
        suppliersToAllocate = allSuppliers.slice(1, 3); // Suppliers 2 and 3
        break;
      case 'CLM006': // 3 suppliers
        suppliersToAllocate = allSuppliers.slice(0, 3); // First 3 suppliers
        break;
      case 'CLM008': // 0 suppliers
      case 'CLM004': // 0 suppliers
        break;
      default: // 1 random supplier for all other claims
        const randomSupplier =
          allSuppliers[Math.floor(Math.random() * allSuppliers.length)];
        suppliersToAllocate = [randomSupplier];
    }

    // Create allocations
    if (suppliersToAllocate.length > 0) {
      await Promise.all(
        suppliersToAllocate.map((supplier) =>
          prisma.allocatedSupplier.create({
            data: {
              claimId: claim.id,
              supplierId: supplier.id,
            },
          })
        )
      );
    }
  }

  console.log('Calculating claim values...');

  // Recalculate values for all claims except CLM003 and CLM004
  const claimsToCalculate = claims.filter(
    (claim) => claim.claimNumber !== 'CLM003' && claim.claimNumber !== 'CLM004'
  );

  for (const claim of claimsToCalculate) {
    await recalculateClaimValues(claim.id);
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
