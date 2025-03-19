import { PrismaClient, Prisma } from '@prisma/client';

// This is a simplified version of claimHelpers.ts specifically for the prisma seed script
// It's placed directly in the prisma directory to avoid import path issues in production

// Create a PrismaClient instance
const prisma = new PrismaClient();

type Item = {
  insuredsQuote: number | null;
  ourQuote: number | null;
  quantity: number;
};

export const calculateClaimValues = (items: Item[]) => {
  const totalClaimed = items.reduce(
    (sum, item) => sum + (item.insuredsQuote || 0) * (item.quantity || 1),
    0
  );
  const totalApproved = items.reduce(
    (sum, item) => sum + (item.ourQuote || 0) * (item.quantity || 1),
    0
  );

  const totalItems = items.length;
  const insuredQuotesComplete = items.filter(
    (item) => item.insuredsQuote !== null
  ).length;
  const ourQuotesComplete = items.filter(
    (item) => item.ourQuote !== null
  ).length;

  return {
    totalClaimed,
    totalApproved,
    totalItems,
    insuredQuotesComplete,
    ourQuotesComplete,
    insuredProgressPercent:
      totalItems > 0 ? (insuredQuotesComplete / totalItems) * 100 : 0,
    ourProgressPercent:
      totalItems > 0 ? (ourQuotesComplete / totalItems) * 100 : 0,
    lastProgressUpdate: new Date(),
  };
};

export const recalculateClaimValues = async (
  claimId: number,
  tx: Prisma.TransactionClient = prisma
) => {
  const claim = await tx.claim.findUnique({
    where: { id: claimId },
    include: {
      items: {
        select: {
          insuredsQuote: true,
          ourQuote: true,
          quantity: true,
        },
      },
    },
  });

  if (!claim) return null;

  const values = calculateClaimValues(claim.items);

  // Update claim with calculated values
  return tx.claim.update({
    where: { id: claimId },
    data: values,
  });
};
