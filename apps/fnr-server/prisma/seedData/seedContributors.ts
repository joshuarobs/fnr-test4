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
    await prisma.claim.update({
      where: { id: createdClaim.id },
      data: {
        contributors: {
          connect: [{ id: handlerId }],
        },
      },
    });

    // Add additional contributors for specific claims
    if (createdClaim.claimNumber === 'CLM002') {
      await prisma.claim.update({
        where: { id: createdClaim.id },
        data: {
          contributors: {
            connect: [{ id: createdStaffMembers[2].id }], // David Thompson
          },
        },
      });
    } else if (createdClaim.claimNumber === 'CLM006') {
      await prisma.claim.update({
        where: { id: createdClaim.id },
        data: {
          contributors: {
            connect: [{ id: createdStaffMembers[3].id }], // Lisa Anderson
          },
        },
      });
    } else if (createdClaim.claimNumber === 'CLM007') {
      await prisma.claim.update({
        where: { id: createdClaim.id },
        data: {
          contributors: {
            connect: [{ id: createdStaffMembers[1].id }], // Mike Williams
          },
        },
      });
    } else if (createdClaim.claimNumber === 'CLM009') {
      await prisma.claim.update({
        where: { id: createdClaim.id },
        data: {
          contributors: {
            connect: [
              { id: createdAdmin.id },
              { id: createdStaffMembers[0].id }, // Sarah Johnson
              { id: createdStaffMembers[1].id }, // Mike Williams
            ],
          },
        },
      });
    }
  }
}
