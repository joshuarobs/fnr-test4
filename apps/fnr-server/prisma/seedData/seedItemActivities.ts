import { PrismaClient, ActivityType } from '@prisma/client';

export async function seedItemActivities(
  prisma: PrismaClient,
  createdClaim: { id: number; claimNumber: string },
  handlerId: number | undefined,
  items: any[]
) {
  if (!handlerId) return;

  if (
    createdClaim.claimNumber === 'CLM001' ||
    createdClaim.claimNumber === 'CLM009'
  ) {
    // For CLM001 and CLM009, create a single activity for all items
    await prisma.activityLog.create({
      data: {
        activityType: ActivityType.ITEM_CREATED,
        userId: handlerId,
        claimId: createdClaim.id,
        metadata: {
          itemNames: items.map((item) => item.name),
          batchCreation: true,
        },
      },
    });
  } else {
    // For other claims, create individual activities for each item
    for (const item of items) {
      await prisma.activityLog.create({
        data: {
          activityType: ActivityType.ITEM_CREATED,
          userId: handlerId,
          claimId: createdClaim.id,
          metadata: {
            itemName: item.name,
            category: item.category,
            roomCategory: item.roomCategory,
          },
        },
      });
    }
  }
}
