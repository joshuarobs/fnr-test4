import { PrismaClient } from '@prisma/client';

export async function seedContributors(
  prisma: PrismaClient,
  createdClaim: { id: number; claimNumber: string },
  handlerId: number | null,
  createdAdmin: { id: number },
  createdStaffMembers: { id: number }[]
) {
  // Add handler as initial contributor if handler exists
  if (handlerId) {
    // Add handler as initial contributor
    await prisma.claimContributor.create({
      data: {
        claimId: createdClaim.id,
        userId: handlerId,
      },
    });

    // Add additional contributors for specific claims
    if (createdClaim.claimNumber === 'CLM002') {
      await prisma.claimContributor.create({
        data: {
          claimId: createdClaim.id,
          userId: createdStaffMembers[2].id, // David Thompson
        },
      });
    } else if (createdClaim.claimNumber === 'CLM006') {
      await prisma.claimContributor.create({
        data: {
          claimId: createdClaim.id,
          userId: createdStaffMembers[3].id, // Lisa Anderson
        },
      });
    } else if (createdClaim.claimNumber === 'CLM007') {
      await prisma.claimContributor.create({
        data: {
          claimId: createdClaim.id,
          userId: createdStaffMembers[1].id, // Mike Williams
        },
      });
    } else if (createdClaim.claimNumber === 'CLM009') {
      // Add multiple contributors
      await Promise.all([
        prisma.claimContributor.create({
          data: {
            claimId: createdClaim.id,
            userId: createdAdmin.id,
          },
        }),
        prisma.claimContributor.create({
          data: {
            claimId: createdClaim.id,
            userId: createdStaffMembers[0].id, // Sarah Johnson
          },
        }),
        prisma.claimContributor.create({
          data: {
            claimId: createdClaim.id,
            userId: createdStaffMembers[1].id, // Mike Williams
          },
        }),
      ]);
    }
  }
}
