import prisma from './prisma';

export const recalculateClaimValues = async (claimId: number) => {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      items: true,
    },
  });

  if (!claim) return null;

  // Calculate totals from items
  const totalClaimed = claim.items.reduce(
    (sum, item) => sum + (item.insuredsQuote || 0),
    0
  );
  const totalApproved = claim.items.reduce(
    (sum, item) => sum + (item.ourQuote || 0),
    0
  );

  // Calculate progress values
  const totalItems = claim.items.length;
  const insuredQuotesComplete = claim.items.filter(
    (item) => item.insuredsQuote !== null
  ).length;
  const ourQuotesComplete = claim.items.filter(
    (item) => item.ourQuote !== null
  ).length;

  const insuredProgressPercent =
    totalItems > 0 ? (insuredQuotesComplete / totalItems) * 100 : 0;
  const ourProgressPercent =
    totalItems > 0 ? (ourQuotesComplete / totalItems) * 100 : 0;

  // Update claim with calculated values
  return prisma.claim.update({
    where: { id: claimId },
    data: {
      totalClaimed,
      totalApproved,
      totalItems,
      insuredQuotesComplete,
      ourQuotesComplete,
      insuredProgressPercent,
      ourProgressPercent,
      lastProgressUpdate: new Date(),
    },
  });
};
