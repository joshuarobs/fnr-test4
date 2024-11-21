import prisma from './prisma';
import { PrismaClient, Prisma } from '@prisma/client';

type Item = {
  insuredsQuote: number | null;
  ourQuote: number | null;
};

export const calculateClaimValues = (items: Item[]) => {
  const totalClaimed = items.reduce(
    (sum, item) => sum + (item.insuredsQuote || 0),
    0
  );
  const totalApproved = items.reduce(
    (sum, item) => sum + (item.ourQuote || 0),
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
